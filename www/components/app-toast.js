class AppToast extends HTMLElement {
  connectedCallback() {
    this.classList.add('fixed', 'bottom-4', 'left-4', 'right-4');
    this.style.zIndex = '200';
  }

  show(message, type = 'error', duration = 3000) {
    const toastEl = document.createElement('div');
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

    this.appendChild(toastEl);
    requestAnimationFrame(() => {
      toastEl.style.animation = 'fadeIn 0.3s ease-out';
    });

    setTimeout(() => toastEl.remove(), duration);
  }
}

if (!customElements.get('app-toast')) {
  customElements.define('app-toast', AppToast);
}