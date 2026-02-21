const screenList = document.getElementById('screen-list');
const screenPlayer = document.getElementById('screen-player');
const radioListContainer = document.getElementById('radio-list');
const audioPlayer = document.getElementById('audio-player');
const playerStationName = document.getElementById('player-station-name');
const playerStationNameMini = document.getElementById('player-station-name-mini');
const playerStatus = document.getElementById('player-status');
const playerStatusMini = document.getElementById('player-status-mini');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const playIconMini = document.getElementById('play-icon-mini');
const pauseIconMini = document.getElementById('pause-icon-mini');
const waveContainer = document.getElementById('wave-container');
const toastContainer = document.getElementById('toast-container');
const volumeSlider = document.getElementById('volume-slider');

let isPlaying = false;
let isLoading = false;
let isMinimized = true;
let currentStation = null;
let stations = [];

// Volumen inicial y control
audioPlayer.volume = 1;
volumeSlider.addEventListener('input', () => {
  audioPlayer.volume = volumeSlider.value / 100;
});

// Listeners de eventos del audio
audioPlayer.addEventListener('loadstart', () => {
  isLoading = true;
  updateUI();
});

audioPlayer.addEventListener('waiting', () => {
  isLoading = true;
  updateUI();
});

audioPlayer.addEventListener('canplay', () => {
  isLoading = false;
  updateUI();
});

audioPlayer.addEventListener('playing', () => {
  isPlaying = true;
  isLoading = false;
  updateUI();
});

audioPlayer.addEventListener('pause', () => {
  isPlaying = false;
  updateUI();
});

audioPlayer.addEventListener('error', () => {
  isPlaying = false;
  isLoading = false;
  updateUI();
  const message = getConnectivityMessage(
    'No se pudo sintonizar. Verificá tu conexión a internet.',
    'No se pudo sintonizar la emisora.'
  );
  showToast(message, 'error');
});

function getConnectivityMessage(offlineMessage, defaultMessage) {
  return !navigator.onLine ? offlineMessage : defaultMessage;
}

function showToast(message, type = 'error', duration = 3000) {
  const toastId = `toast-${Date.now()}`;
  const toastEl = document.createElement('div');
  toastEl.id = toastId;
  
  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-500' : 'bg-green-500';
  const iconPath = isError 
    ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="6" x2="12" y2="12"></line><circle cx="12" cy="16" r="1"></circle>'
    : '<polyline points="20 6 9 17 4 12"></polyline>';
  
  toastEl.className = `p-4 rounded-lg text-white font-semibold flex items-center gap-3 mb-2 ${bgColor}`;
  toastEl.innerHTML = `
    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${iconPath}
    </svg>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toastEl);
  // Aplicar animación fadeIn después de agregar al DOM
  requestAnimationFrame(() => {
    toastEl.style.animation = 'fadeIn 0.3s ease-out';
  });
  
  setTimeout(() => toastEl.remove(), duration);
}

function renderSkeleton() {
  const skeletonItems = Array.from({ length: 5 }, (_, i) => `
    <div class="skeleton-item">
      <div class="skeleton-icon"></div>
      <div class="flex-1">
        <div class="skeleton-text skeleton-text-title"></div>
        <div class="skeleton-text skeleton-text-subtitle"></div>
      </div>
    </div>
  `).join('');
  radioListContainer.innerHTML = skeletonItems;
}

function renderList(stations) {
  radioListContainer.innerHTML = stations.map(station => `
    <button class="radio-item" onclick="openPlayer(${station.id})" aria-label="Sintonizar ${station.name}">
      <div class="radio-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>
      </div>
      <div>
        <div class="font-semibold text-lg">${station.name}</div>
        <div class="text-xs text-gray-400">Transmisión Digital</div>
      </div>
    </button>
  `).join('');
}

async function init() {
  renderSkeleton();
  try {
    const response = await fetch(URL_RESOURCES);
    stations = await response.json();
    renderList(stations);
  } catch (error) {
    radioListContainer.innerHTML = '';
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

  // Actualizar nombres en ambas vistas
  playerStationName.innerText = station.name;
  playerStationNameMini.innerText = station.name;

  // Si es una estación nueva, cargamos la URL
  if (audioPlayer.src !== station.url) {
    audioPlayer.src = station.url;
    isPlaying = false;
    isLoading = false;
    updateUI();
  }

  // Mostrar reproductor (inicia minimizado)
  screenPlayer.classList.add('visible');
  if (!screenPlayer.classList.contains('minimized')) {
    screenPlayer.classList.add('minimized');
  }
  screenPlayer.classList.remove('maximized');
  isMinimized = true;

  // Autoplay al abrir
  if(!isPlaying) {
    togglePlayback();
  }
}

function togglePlayerSize() {
  isMinimized = !isMinimized;
  
  if (isMinimized) {
    screenPlayer.classList.remove('maximized');
    screenPlayer.classList.add('minimized');
  } else {
    screenPlayer.classList.remove('minimized');
    screenPlayer.classList.add('maximized');
  }
}

function togglePlayback() {
  if (isPlaying) {
    audioPlayer.pause();
  } else {
    isLoading = true;
    updateUI();
    audioPlayer.load();
    audioPlayer.play().catch(e => {
      isPlaying = false;
      isLoading = false;
      updateUI();
      const message = getConnectivityMessage(
        'No se pudo sintonizar. Verificá tu conexión a internet.',
        'No se pudo sintonizar la emisora.'
      );
      showToast(message, 'error');
    });
  }
}

function updateUI() {
  const mainPlayBtn = document.getElementById('main-play-btn');
  const miniPlayBtn = document.getElementById('mini-play-btn');
  
  if (isLoading) {
    // Estado: Sintonizando
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    playIconMini.classList.remove('hidden');
    pauseIconMini.classList.add('hidden');
    waveContainer.classList.remove('paused');
    waveContainer.classList.remove('playing');
    waveContainer.classList.add('loading');
    playerStatus.innerText = 'Sintonizando';
    playerStatusMini.innerText = 'Sintonizando';
    mainPlayBtn.classList.add('disabled');
    miniPlayBtn.classList.add('disabled');
  } else if (isPlaying) {
    // Estado: Al aire
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    playIconMini.classList.add('hidden');
    pauseIconMini.classList.remove('hidden');
    waveContainer.classList.remove('paused');
    waveContainer.classList.remove('loading');
    waveContainer.classList.add('playing');
    playerStatus.innerText = 'Al aire';
    playerStatusMini.innerText = 'Al aire';
    mainPlayBtn.classList.remove('disabled');
    miniPlayBtn.classList.remove('disabled');
  } else {
    // Estado: Detenido
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    playIconMini.classList.remove('hidden');
    pauseIconMini.classList.add('hidden');
    waveContainer.classList.add('paused');
    waveContainer.classList.remove('playing');
    waveContainer.classList.remove('loading');
    playerStatus.innerText = 'Detenido';
    playerStatusMini.innerText = 'Detenido';
    mainPlayBtn.classList.remove('disabled');
    miniPlayBtn.classList.remove('disabled');
  }
}

init();