const audioPlayer = document.getElementById('audio-player');

let isPlaying = false;
let isLoading = false;
let isMinimized = true;
let currentStation = null;
let stations = [];

// Volumen inicial y control
audioPlayer.volume = 1;
$('#volume-slider').on('input', function () {
  audioPlayer.volume = $(this).val() / 100;
});

// Listeners de eventos del audio
$(audioPlayer)
  .on('loadstart', function () {
    isLoading = true;
    updateUI();
  })
  .on('waiting', function () {
    isLoading = true;
    updateUI();
  })
  .on('canplay', function () {
    isLoading = false;
    updateUI();
  })
  .on('playing', function () {
    isPlaying = true;
    isLoading = false;
    updateUI();
  })
  .on('pause', function () {
    isPlaying = false;
    updateUI();
  })
  .on('error', function () {
    isPlaying = false;
    isLoading = false;
    updateUI();
    const message = getConnectivityMessage(
      'No pudimos sintonizar. Verificá tu conexión a internet.',
      'No pudimos sintonizar la emisora.'
    );
    showToast(message, 'error');
  });

function getConnectivityMessage(offlineMessage, defaultMessage) {
  return !navigator.onLine ? offlineMessage : defaultMessage;
}

function showToast(message, type = 'error', duration = 3000) {
  const toastId = `toast-${Date.now()}`;
  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-500' : 'bg-green-500';
  const iconPath = isError
    ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="6" x2="12" y2="12"></line><circle cx="12" cy="16" r="1"></circle>'
    : '<polyline points="20 6 9 17 4 12"></polyline>';

  const $toast = $('<div>')
    .attr('id', toastId)
    .addClass(`p-4 rounded-lg text-white font-semibold flex items-center gap-3 mb-2 ${bgColor}`)
    .html(`
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${iconPath}
      </svg>
      <span>${message}</span>
    `);

  $('#toast-container').append($toast);
  requestAnimationFrame(() => {
    $toast.css('animation', 'fadeIn 0.3s ease-out');
  });

  setTimeout(() => $toast.remove(), duration);
}

function renderSkeleton() {
  const skeletonItems = Array.from({ length: 5 }, () => `
    <div class="skeleton-item">
      <div class="skeleton-icon"></div>
      <div class="flex-1">
        <div class="skeleton-text skeleton-text-title"></div>
        <div class="skeleton-text skeleton-text-subtitle"></div>
      </div>
    </div>
  `).join('');
  $('#radio-list').html(skeletonItems);
}

function renderList(stations) {
  $('#radio-list').html(stations.map(station => `
    <button class="radio-item" onclick="openPlayer(${station.id})" aria-label="Sintonizar ${station.name}">
      <div class="radio-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>
      </div>
      <div>
        <div class="font-semibold text-lg">${station.name}</div>
        <div class="text-xs text-gray-400">Transmisión Digital</div>
      </div>
    </button>
  `).join(''));
}

async function init() {
  renderSkeleton();
  try {
    const response = await fetch(URL_RESOURCES);
    stations = await response.json();
    renderList(stations);
  } catch (error) {
    $('#radio-list').html('');
    const message = getConnectivityMessage(
      'No pudimos cargar la lista. Verificá tu conexión a internet.',
      'No pudimos cargar la lista de radios.'
    );
    showToast(message, 'error');
  }
}

function openPlayer(stationId) {
  const station = stations.find(s => s.id === stationId);
  currentStation = station;

  $('#player-station-name').text(station.name);
  $('#player-station-name-mini').text(station.name);

  if (audioPlayer.src !== station.url) {
    audioPlayer.src = station.url;
    isPlaying = false;
    isLoading = false;
    updateUI();
  }

  $('#screen-player').addClass('visible');
  if (!$('#screen-player').hasClass('minimized')) {
    $('#screen-player').addClass('minimized');
  }
  $('#screen-player').removeClass('maximized');
  isMinimized = true;

  if (!isPlaying) {
    togglePlayback();
  }
}

function togglePlayerSize() {
  isMinimized = !isMinimized;

  if (isMinimized) {
    $('#screen-player').removeClass('maximized').addClass('minimized');
  } else {
    $('#screen-player').removeClass('minimized').addClass('maximized');
  }
}

function togglePlayback() {
  if (isPlaying) {
    audioPlayer.pause();
  } else {
    isLoading = true;
    updateUI();
    audioPlayer.load();
    audioPlayer.play().catch(() => {
      isPlaying = false;
      isLoading = false;
      updateUI();
      const message = getConnectivityMessage(
        'No pudimos sintonizar. Verificá tu conexión a internet.',
        'No pudimos sintonizar la emisora.'
      );
      showToast(message, 'error');
    });
  }
}

function updateUI() {
  const $mainPlayBtn = $('#main-play-btn');
  const $miniPlayBtn = $('#mini-play-btn');

  if (isLoading) {
    $('#play-icon').removeClass('hidden');
    $('#pause-icon').addClass('hidden');
    $('#play-icon-mini').removeClass('hidden');
    $('#pause-icon-mini').addClass('hidden');
    $('#wave-container').removeClass('paused playing').addClass('loading');
    $('#player-status').text('Sintonizando');
    $('#player-status-mini').text('Sintonizando');
    $mainPlayBtn.addClass('disabled');
    $miniPlayBtn.addClass('disabled');
  } else if (isPlaying) {
    $('#play-icon').addClass('hidden');
    $('#pause-icon').removeClass('hidden');
    $('#play-icon-mini').addClass('hidden');
    $('#pause-icon-mini').removeClass('hidden');
    $('#wave-container').removeClass('paused loading').addClass('playing');
    $('#player-status').text('Al aire');
    $('#player-status-mini').text('Al aire');
    $mainPlayBtn.removeClass('disabled');
    $miniPlayBtn.removeClass('disabled');
  } else {
    $('#play-icon').removeClass('hidden');
    $('#pause-icon').addClass('hidden');
    $('#play-icon-mini').removeClass('hidden');
    $('#pause-icon-mini').addClass('hidden');
    $('#wave-container').addClass('paused').removeClass('playing loading');
    $('#player-status').text('Detenido');
    $('#player-status-mini').text('Detenido');
    $mainPlayBtn.removeClass('disabled');
    $miniPlayBtn.removeClass('disabled');
  }
}

$(function () {
  init();
});
