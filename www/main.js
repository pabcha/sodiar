function sodiar() {
  return {
    stations: [],
    currentStation: null,
    isPlaying: false,
    isLoading: false,
    showPlayer: false,
    toastQueue: [],
    hasInitialized: false,

    async init() {
      if (this.hasInitialized) return;
      this.hasInitialized = true;
      this.isLoading = true;
      await this.loadStations();
      this.isLoading = false;
    },

    async loadStations() {
      try {
        const response = await fetch(URL_RESOURCES);
        if (!response.ok) {
          throw new Error('fetch_failed');
        }
        this.stations = await response.json();
      } catch (error) {
        this.stations = [];
        this.toast('No pudimos cargar la lista de radios.', 'error');
      }
    },

    openPlayer(station) {
      if (!station) return;

      const isNewStation = !this.currentStation || this.currentStation.id !== station.id;
      this.currentStation = station;

      if (isNewStation) {
        this.isPlaying = false;
        this.$refs.audioPlayer.src = station.url;
      }

      this.showPlayer = true;
      this.autoplayIfNeeded();
    },

    closePlayer() {
      this.showPlayer = false;
    },

    async togglePlayback() {
      if (!this.currentStation) return;

      const audio = this.$refs.audioPlayer;

      if (this.isPlaying) {
        audio.pause();
        this.isPlaying = false;
        return;
      }

      try {
        audio.load();
        await audio.play();
        this.isPlaying = true;
      } catch (error) {
        this.isPlaying = false;
        this.toast('No se pudo sintonizar la emisora.', 'error');
      }
    },

    autoplayIfNeeded() {
      if (!this.isPlaying) {
        this.togglePlayback();
      }
    },

    toast(message, type = 'error', duration = 3000) {
      const hasSameToast = this.toastQueue.some(toast => toast.message === message && toast.type === type);
      if (hasSameToast) return;

      const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `toast-${Date.now()}`;
      this.toastQueue.push({ id, message, type });

      setTimeout(() => {
        this.toastQueue = this.toastQueue.filter(toast => toast.id !== id);
      }, duration);
    },

    get statusLabel() {
      return this.isPlaying ? 'Al aire' : 'Detenido';
    }
  };
}