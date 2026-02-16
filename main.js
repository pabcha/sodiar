const screenList = document.getElementById('screen-list');
const screenPlayer = document.getElementById('screen-player');
const radioListContainer = document.getElementById('radio-list');
const audioPlayer = document.getElementById('audio-player');
const playerStationName = document.getElementById('player-station-name');
const playerStatus = document.getElementById('player-status');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const waveContainer = document.getElementById('wave-container');
const toastContainer = document.getElementById('toast-container');

let isPlaying = false;
let currentStation = null;

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

function renderList(stations) {
  radioListContainer.innerHTML = stations.map(station => `
    <div class="radio-item" onclick="openPlayer(${station.id})">
      <div class="radio-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>
      </div>
      <div>
        <div class="font-semibold text-lg">${station.name}</div>
        <div class="text-xs text-gray-400">Streaming HD</div>
      </div>
    </div>
  `).join('');
}

async function init() {
  try {
    const response = await fetch(URL_RESOURCES);
    const stations = await response.json();
    renderList(stations);
  } catch (error) {
    showToast('Error al traer los datos.', 'error');
  }
}

// Aplicar animación fadeIn a los toasts
function addFadeInAnimation(element) {
  element.style.animation = 'fadeIn 0.3s ease-out';
}

function openPlayer(stationId) {
  const station = stations.find(s => s.id === stationId);
  currentStation = station;

  playerStationName.innerText = station.name;

  // Si es una estación nueva, cargamos la URL
  if (audioPlayer.src !== station.url) {
    audioPlayer.src = station.url;
    isPlaying = false;
    updateUI();
  }

  // Transición
  screenList.classList.add('hidden-list');
  screenPlayer.classList.add('active');

  // Autoplay al abrir
  if(!isPlaying) {
    togglePlayback();
  }
}

function closePlayer() {
  screenList.classList.remove('hidden-list');
  screenPlayer.classList.remove('active');
}

function togglePlayback() {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
  } else {
    audioPlayer.load();
    audioPlayer.play().catch(e => {
      isPlaying = false;
      updateUI();
      showToast('Error al conectar con la radio.', 'error');
    });
    isPlaying = true;
  }
  updateUI();
}

function updateUI() {
  if (isPlaying) {
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    waveContainer.classList.remove('paused');
    waveContainer.classList.add('playing');
    playerStatus.innerText = 'Reproduciendo';
  } else {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    waveContainer.classList.add('paused');
    waveContainer.classList.remove('playing');
    playerStatus.innerText = 'En pausa';
  }
}

init();