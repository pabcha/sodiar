class RadioStationList extends HTMLElement {
  constructor() {
    super();
    this._stations = [];
    this._isLoading = false;
    this._skeletonCount = 5;
  }

  connectedCallback() {
    this.render();
    this.addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick);
  }

  setLoading(isLoading = true, skeletonCount = 5) {
    this._isLoading = isLoading;
    this._skeletonCount = skeletonCount;
    this.render();
  }

  setStations(stations = []) {
    this._stations = Array.isArray(stations) ? stations : [];
    this._isLoading = false;
    this.render();
  }

  clear() {
    this._stations = [];
    this._isLoading = false;
    this.render();
  }

  handleClick = (event) => {
    const stationButton = event.target.closest('[data-station-id]');
    if (!stationButton) {
      return;
    }

    const stationId = stationButton.getAttribute('data-station-id');
    this.dispatchEvent(new CustomEvent('station-select', {
      detail: { stationId },
      bubbles: true,
      composed: true
    }));
  };

  renderSkeleton() {
    return Array.from({ length: this._skeletonCount }, () => `
      <div class="skeleton-item">
        <div class="skeleton-icon"></div>
        <div class="flex-1">
          <div class="skeleton-text skeleton-text-title"></div>
          <div class="skeleton-text skeleton-text-subtitle"></div>
        </div>
      </div>
    `).join('');
  }

  renderStations() {
    return this._stations.map((station) => `
      <button class="radio-item" data-station-id="${station.id}" aria-label="Sintonizar ${station.name}">
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

  render() {
    if (this._isLoading) {
      this.innerHTML = this.renderSkeleton();
      return;
    }

    this.innerHTML = this.renderStations();
  }
}

if (!customElements.get('radio-station-list')) {
  customElements.define('radio-station-list', RadioStationList);
}