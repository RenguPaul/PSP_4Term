const API_BASE = '/api/stocks';
let currentSearch = '';

// Загрузка и отрисовка
async function loadStocks(titleFilter = '') {
    try {
        let url = API_BASE;
        if (titleFilter) url += `?title=${encodeURIComponent(titleFilter)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Ошибка загрузки');
        const stocks = await res.json();
        renderStocks(stocks);
    } catch (err) {
        console.error(err);
        document.getElementById('stocksGrid').innerHTML = '<p class="error">❌ Не удалось загрузить акции</p>';
    }
}

function renderStocks(stocks) {
    const grid = document.getElementById('stocksGrid');
    if (!stocks.length) {
        grid.innerHTML = '<div class="empty">😞 Ни одной акции не найдено</div>';
        return;
    }
    grid.innerHTML = stocks.map(stock => `
        <div class="stock-card" data-id="${stock.id}">
            <img src="${stock.src}" alt="${stock.title}" onerror="this.src='https://via.placeholder.com/300?text=Image+not+found'">
            <div class="card-content">
                <h3>${escapeHtml(stock.title)}</h3>
                <p>${escapeHtml(stock.text)}</p>
                <div class="card-actions">
                    <button class="edit-btn" onclick="openEditModal(${stock.id})">✏️ Редактировать</button>
                    <button class="delete-btn" onclick="deleteStock(${stock.id})">🗑 Удалить</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Создание
document.getElementById('stockForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const src = document.getElementById('src').value.trim();
    const text = document.getElementById('text').value.trim();
    if (!title || !src || !text) return alert('Заполните все поля');

    try {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, src, text })
        });
        if (!res.ok) throw new Error('Ошибка создания');
        document.getElementById('stockForm').reset();
        loadStocks(currentSearch);
    } catch (err) {
        alert(err.message);
    }
});

// Удаление
window.deleteStock = async (id) => {
    if (!confirm('Удалить акцию?')) return;
    try {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Не удалось удалить');
        loadStocks(currentSearch);
    } catch (err) {
        alert(err.message);
    }
};

// Редактирование (модальное окно)
const modal = document.getElementById('editModal');
const closeModal = document.querySelector('.close');
const editForm = document.getElementById('editForm');

window.openEditModal = async (id) => {
    try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error('Не найдено');
        const stock = await res.json();
        document.getElementById('editId').value = stock.id;
        document.getElementById('editTitle').value = stock.title;
        document.getElementById('editSrc').value = stock.src;
        document.getElementById('editText').value = stock.text;
        modal.style.display = 'flex';
    } catch (err) {
        alert(err.message);
    }
};

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById('editId').value);
    const title = document.getElementById('editTitle').value.trim();
    const src = document.getElementById('editSrc').value.trim();
    const text = document.getElementById('editText').value.trim();
    if (!title || !src || !text) return alert('Заполните все поля');

    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, src, text })
        });
        if (!res.ok) throw new Error('Ошибка обновления');
        modal.style.display = 'none';
        loadStocks(currentSearch);
    } catch (err) {
        alert(err.message);
    }
});

closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

// Поиск
document.getElementById('searchBtn').addEventListener('click', () => {
    currentSearch = document.getElementById('searchInput').value.trim();
    loadStocks(currentSearch);
});
document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    currentSearch = '';
    loadStocks('');
});
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('searchBtn').click();
});

// Helper
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Инициализация
loadStocks();