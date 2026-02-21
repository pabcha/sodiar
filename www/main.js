const screenList = document.getElementById('screen-list');
const screenPlayer = document.getElementById('radio-player-panel');
const radioListContainer = document.getElementById('radio-station-list');
const audioPlayer = document.getElementById('audio-player');
const toastContainer = document.getElementById('app-toast');

let isPlaying = false;
let isLoading = false;
let isMinimized = true;
let currentStation = null;
let stations = [];
let lastTuneErrorToastAt = 0;

screenList.addEventListener('station-select', (event) => {
  openPlayer(event.detail.stationId);
});

screenPlayer.addEventListener('playback-toggle', () => {
  togglePlayback();
});

screenPlayer.addEventListener('player-size-toggle', () => {
  togglePlayerSize();
});

screenPlayer.addEventListener('volume-change', (event) => {
  audioPlayer.volume = event.detail.volume / 100;
});

audioPlayer.volume = screenPlayer.getVolume() / 100;

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
  showTuneErrorToast();
});

function showTuneErrorToast() {
  const now = Date.now();
  if (now - lastTuneErrorToastAt < 1500) {
    return;
  }

  lastTuneErrorToastAt = now;
  const message = getConnectivityMessage(
    'No pudimos sintonizar. Verificá tu conexión a internet.',
    'No pudimos sintonizar la emisora.'
  );
  showToast(message, 'error');
}

function getConnectivityMessage(offlineMessage, defaultMessage) {
  return !navigator.onLine ? offlineMessage : defaultMessage;
}

function showToast(message, type = 'error', duration = 3000) {
  toastContainer.show(message, type, duration);
}

function renderSkeleton() {
  radioListContainer.setLoading(true, 5);
}

function renderList(stations) {
  radioListContainer.setStations(stations);
}

async function init() {
  renderSkeleton();
  try {
    const response = await fetch(URL_RESOURCES);
    stations = await response.json();
    renderList(stations);
  } catch (error) {
    radioListContainer.clear();
    const message = getConnectivityMessage(
      'No pudimos cargar la lista. Verificá tu conexión a internet.',
      'No pudimos cargar la lista de radios.'
    );
    showToast(message, 'error');
  }
}

function openPlayer(stationId) {
  const station = stations.find((item) => String(item.id) === String(stationId));
  if (!station) {
    return;
  }

  currentStation = station;
  screenPlayer.setStation(station.name);

  // Si es una estación nueva, cargamos la URL
  if (audioPlayer.src !== station.url) {
    audioPlayer.src = station.url;
    isPlaying = false;
    isLoading = false;
    updateUI();
  }

  screenPlayer.setVisible(true);
  screenPlayer.setMinimized(true);
  isMinimized = true;

  if (!isPlaying) {
    togglePlayback();
  }
}

function togglePlayerSize() {
  isMinimized = !isMinimized;
  screenPlayer.setMinimized(isMinimized);
}

function togglePlayback() {
  if (!currentStation) {
    return;
  }

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
      showTuneErrorToast();
    });
  }
}

function updateUI() {
  screenPlayer.setPlaybackState({ isPlaying, isLoading });
}

init();