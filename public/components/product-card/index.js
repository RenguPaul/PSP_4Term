export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }
    getHTML(data) {
        return `
            <div class="stock-card" data-id="${data.id}">
                <img src="${data.src}" alt="${data.title}" onerror="this.src='https://via.placeholder.com/300?text=no+image'">
                <div class="card-content">
                    <h3>${this.escapeHtml(data.title)}</h3>
                    <p>${this.escapeHtml(data.text)}</p>
                    <div class="card-actions">
                        <button class="detail-btn" data-id="${data.id}">Подробнее</button>
                    </div>
                </div>
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
    addListeners(listener) {
        const btns = this.parent.querySelectorAll('.detail-btn');
        btns.forEach(btn => {
            btn.removeEventListener('click', listener);
            btn.addEventListener('click', listener);
        });
    }
    render(data, listener) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
        this.addListeners(listener);
    }
}