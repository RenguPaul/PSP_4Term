export class ProductFullComponent {
  constructor(parent) {
    this.parent = parent;
  }
  getHTML(data) {
    return `
      <div class="detail-card">
        <img src="${data.src}" alt="${data.title}">
        <h2>${this.escapeHtml(data.title)}</h2>
        <p>${this.escapeHtml(data.text)}</p>
        <div class="card-actions">
          <button id="delete-btn" data-id="${data.id}" class="btn delete-btn">🗑 Удалить</button>
        </div>
        <hr>
        <h3>Редактировать</h3>
        <form id="edit-form">
          <div class="form-group">
            <input type="text" id="edit-title" value="${this.escapeHtml(data.title)}" placeholder="Заголовок" required>
          </div>
          <div class="form-group">
            <input type="text" id="edit-src" value="${this.escapeHtml(data.src)}" placeholder="URL изображения" required>
          </div>
          <div class="form-group">
            <textarea id="edit-text" rows="3" required>${this.escapeHtml(data.text)}</textarea>
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="submit">Сохранить изменения</button>
            <button type="button" id="cancel-btn" class="btn" style="background: #6c757d;">Отмена</button>
          </div>
        </form>
      </div>
    `;
  }
  escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }
  addDeleteListener(listener) {
    const btn = document.getElementById('delete-btn');
    if (btn) btn.addEventListener('click', listener);
  }
  addEditListener(listener) {
    const form = document.getElementById('edit-form');
    if (form) form.addEventListener('submit', listener);
  }
  addCancelListener(listener) {
    const btn = document.getElementById('cancel-btn');
    if (btn) btn.addEventListener('click', listener);
  }
  render(data, deleteListener, editListener, cancelListener) {
    this.parent.innerHTML = '';
    this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
    this.addDeleteListener(deleteListener);
    this.addEditListener(editListener);
    this.addCancelListener(cancelListener);
  }
}