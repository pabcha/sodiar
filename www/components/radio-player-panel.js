class RadioPlayerPanel extends HTMLElement {
  constructor() {
    super();
    this._isPlaying = false;
    this._isLoading = false;
    this._isMinimized = true;
    this._isVisible = false;
    this._stationName = 'Selecciona una radio';
  }

  connectedCallback() {
    this.classList.add('player-fixed', 'minimized');
    this.render();
    this.bindEvents();
    this.updateUI();
  }

  bindEvents() {
    const playbackButtons = this.querySelectorAll('[data-action="toggle-playback"]');
    playbackButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('playback-toggle', {
          bubbles: true,
          composed: true
        }));
      });
    });

    const sizeButtons = this.querySelectorAll('[data-action="toggle-player-size"]');
    sizeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('player-size-toggle', {
          bubbles: true,
          composed: true
        }));
      });
    });

    const volumeSlider = this.querySelector('[data-part="volume-slider"]');
    volumeSlider.addEventListener('input', () => {
      this.dispatchEvent(new CustomEvent('volume-change', {
        detail: { volume: Number(volumeSlider.value) },
        bubbles: true,
        composed: true
      }));
    });
  }

  setStation(name) {
    this._stationName = name || 'Selecciona una radio';
    const stationName = this.querySelector('[data-part="player-station-name"]');
    const stationNameMini = this.querySelector('[data-part="player-station-name-mini"]');
    stationName.innerText = this._stationName;
    stationNameMini.innerText = this._stationName;
  }

  setPlaybackState({ isPlaying, isLoading }) {
    this._isPlaying = Boolean(isPlaying);
    this._isLoading = Boolean(isLoading);
    this.updatePlaybackState();
  }

  setVisible(isVisible) {
    this._isVisible = Boolean(isVisible);
    if (this._isVisible) {
      this.classList.add('visible');
      return;
    }
    this.classList.remove('visible');
  }

  setMinimized(isMinimized) {
    this._isMinimized = Boolean(isMinimized);
    this.updateSizeState();
  }

  setVolume(volume) {
    const volumeSlider = this.querySelector('[data-part="volume-slider"]');
    volumeSlider.value = String(volume);
  }

  getVolume() {
    const volumeSlider = this.querySelector('[data-part="volume-slider"]');
    return Number(volumeSlider.value);
  }

  updateSizeState() {
    if (this._isMinimized) {
      this.classList.remove('maximized');
      this.classList.add('minimized');
      return;
    }
    this.classList.remove('minimized');
    this.classList.add('maximized');
  }

  updatePlaybackState() {
    const playIcon = this.querySelector('[data-part="play-icon"]');
    const pauseIcon = this.querySelector('[data-part="pause-icon"]');
    const playIconMini = this.querySelector('[data-part="play-icon-mini"]');
    const pauseIconMini = this.querySelector('[data-part="pause-icon-mini"]');
    const waveContainer = this.querySelector('[data-part="wave-container"]');
    const playerStatus = this.querySelector('[data-part="player-status"]');
    const playerStatusMini = this.querySelector('[data-part="player-status-mini"]');
    const mainPlayBtn = this.querySelector('[data-part="main-play-btn"]');
    const miniPlayBtn = this.querySelector('[data-part="mini-play-btn"]');

    if (this._isLoading) {
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
      return;
    }

    if (this._isPlaying) {
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
      return;
    }

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

  updateUI() {
    this.updateSizeState();
    this.updatePlaybackState();
    this.setVisible(this._isVisible);
    this.setStation(this._stationName);
  }

  render() {
    this.innerHTML = `
      <div class="player-minimized">
        <div class="player-minimized-content">
          <div class="player-minimized-info">
            <h3 data-part="player-station-name-mini" class="player-station-name-mini">${this._stationName}</h3>
            <span data-part="player-status-mini" class="player-status-mini">Al aire</span>
          </div>
          <div class="player-minimized-controls">
            <button data-part="mini-play-btn" class="mini-play-btn" data-action="toggle-playback" aria-label="Reproducir o pausar" type="button">
              <svg data-part="play-icon-mini" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <svg data-part="pause-icon-mini" class="hidden" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            </button>
            <button id="toggle-player-btn" class="toggle-player-btn" data-action="toggle-player-size" aria-label="Expandir reproductor" type="button">
              <svg id="chevron-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="player-maximized">
        <div class="player-header">
          <span data-part="player-status" class="text-xs font-bold tracking-widest uppercase">Al aire</span>
          <button class="toggle-player-btn-max" data-action="toggle-player-size" aria-label="Minimizar reproductor" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        <article>
          <div class="album-art-placeholder">
            <div class="mb-12">
              <h2 data-part="player-station-name" class="text-2xl font-bold mb-1">${this._stationName}</h2>
              <p class="text-gray-400 text-sm">En vivo • Transmisión Digital</p>
            </div>
            <div class="flex flex-col items-center">
              <div data-part="wave-container" class="wave-container paused mb-8">
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
              </div>

              <button data-part="main-play-btn" class="play-btn" data-action="toggle-playback" aria-label="Reproducir o pausar" type="button">
                <svg data-part="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <svg data-part="pause-icon" class="hidden" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>

              <div class="volume-control">
                <svg class="volume-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5zm7-.17v6.34L9.83 13H7v-2h2.83L12 8.83z"/>
                </svg>
                <input type="range" data-part="volume-slider" class="volume-slider" min="0" max="100" value="100" aria-label="Volumen" />
                <svg class="volume-icon volume-icon--high" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </div>
            </div>
          </div>
        </article>
      </div>
    `;
  }
}

if (!customElements.get('radio-player-panel')) {
  customElements.define('radio-player-panel', RadioPlayerPanel);
}