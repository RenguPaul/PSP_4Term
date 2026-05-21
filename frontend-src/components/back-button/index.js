export class BackButtonComponent {
  constructor(parent) {
    this.parent = parent;
  }
  addListeners(listener) {
    const btn = document.getElementById('back-button');
    if (btn) btn.addEventListener('click', listener);
  }
  getHTML() {
    return `<button id="back-button" class="back-button btn">← На главную</button>`;
  }
  render(listener) {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());
    this.addListeners(listener);
  }
}