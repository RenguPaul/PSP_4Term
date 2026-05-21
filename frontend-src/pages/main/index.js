import { api } from '../../modules/api.js';
import { stockUrls } from '../../modules/stockUrls.js';
import { ProductCardComponent } from '../../components/product-card/index.js';
import { ProductPage } from '../product/index.js';

export class MainPage {
  constructor(parent) {
    this.parent = parent;
    this.currentFilter = '';
  }
  get pageRoot() {
    return document.getElementById('main-page');
  }
  getHTML() {
    return `
      <div id="main-page">
        <div class="form-card">
          <h2>➕ Создать новую акцию</h2>
          <form id="create-form">
            <input type="text" id="create-title" placeholder="Заголовок" required>
            <input type="text" id="create-src" placeholder="URL изображения" value="https://i.pinimg.com/originals/c9/ea/65/c9ea654eb3a7398b1f702c758c1c4206.jpg">
            <textarea id="create-text" placeholder="Описание" rows="3" required></textarea>
            <button type="submit">Создать</button>
          </form>
        </div>
        <div class="search-bar">
          <input type="text" id="filter-input" placeholder="🔍 Фильтр по заголовку" value="${this.currentFilter}">
          <button id="search-btn">Найти</button>
          <button id="reset-btn">Сбросить</button>
        </div>
        <div id="stocks-container" class="stocks-grid"></div>
      </div>
    `;
  }
  async render() {
    this.parent.innerHTML = '';
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());
    this.container = document.getElementById('stocks-container');

    document.getElementById('create-form').addEventListener('submit', (e) => this.onCreate(e));
    document.getElementById('search-btn').addEventListener('click', () => this.onFilter());
    document.getElementById('reset-btn').addEventListener('click', () => this.onReset());
    document.getElementById('filter-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.onFilter();
    });

    await this.loadStocks();
  }
  async loadStocks() {
    try {
      const stocks = await api.get(stockUrls.getStocks(this.currentFilter));
      this.renderCards(stocks);
    } catch (error) {
      console.error(error);
      this.container.innerHTML = '<div class="error">Ошибка загрузки</div>';
    }
  }
  renderCards(stocks) {
    this.container.innerHTML = '';
    stocks.forEach(stock => {
      const card = new ProductCardComponent(this.container);
      card.render(stock, (e) => {
        const id = e.target.dataset.id;
        const productPage = new ProductPage(this.parent, id);
        productPage.render();
      });
    });
    if (stocks.length === 0) {
      this.container.innerHTML = '<div class="empty">😞 Ни одной акции не найдено</div>';
    }
  }
  async onCreate(e) {
    e.preventDefault();
    const title = document.getElementById('create-title').value.trim();
    const src = document.getElementById('create-src').value.trim();
    const text = document.getElementById('create-text').value.trim();
    if (!title || !src || !text) {
      alert('Заполните все поля');
      return;
    }
    try {
      await api.post(stockUrls.createStock(), { title, src, text });
      document.getElementById('create-form').reset();
      await this.loadStocks();
    } catch (error) {
      console.error(error);
      alert('Ошибка создания');
    }
  }
  onFilter() {
    this.currentFilter = document.getElementById('filter-input').value.trim();
    this.loadStocks();
  }
  onReset() {
    this.currentFilter = '';
    document.getElementById('filter-input').value = '';
    this.loadStocks();
  }
}