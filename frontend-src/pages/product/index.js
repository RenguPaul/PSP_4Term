import { api } from '../../modules/api.js';
import { stockUrls } from '../../modules/stockUrls.js';
import { BackButtonComponent } from '../../components/back-button/index.js';
import { ProductFullComponent } from '../../components/product-full/index.js';
import { MainPage } from '../main/index.js';

export class ProductPage {
  constructor(parent, id) {
    this.parent = parent;
    this.id = id;
  }
  get pageRoot() {
    return document.getElementById('product-page');
  }
  getHTML() {
    return `<div id="product-page"></div>`;
  }
  render() {
    this.parent.innerHTML = '';
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());
    const backButton = new BackButtonComponent(this.pageRoot);
    backButton.render(() => {
      const mainPage = new MainPage(this.parent);
      mainPage.render();
    });
    this.loadData();
  }
  async loadData() {
    try {
      const stock = await api.get(stockUrls.getStockById(this.id));
      this.renderProduct(stock);
    } catch (error) {
      console.error(error);
      this.pageRoot.innerHTML += '<div class="error">Карточка не найдена</div>';
    }
  }
  renderProduct(stock) {
    const container = this.pageRoot;
    const fullComp = new ProductFullComponent(container);
    fullComp.render(
      stock,
      () => this.onDelete(stock.id),
      (e) => this.onUpdate(e, stock.id),
      () => this.onCancel()   // обработчик для кнопки "Отмена"
    );
  }
  async onDelete(id) {
    if (!confirm('Удалить акцию?')) return;
    try {
      await api.delete(stockUrls.deleteStock(id));
      const mainPage = new MainPage(this.parent);
      mainPage.render();
    } catch (error) {
      console.error(error);
      alert('Ошибка удаления');
    }
  }
  async onUpdate(e, id) {
    e.preventDefault();
    const title = document.getElementById('edit-title').value.trim();
    const src = document.getElementById('edit-src').value.trim();
    const text = document.getElementById('edit-text').value.trim();
    if (!title || !src || !text) {
      alert('Заполните все поля');
      return;
    }
    try {
      await api.patch(stockUrls.updateStock(id), { title, src, text });
      // После сохранения можно остаться на этой же странице (перезагрузить) или уйти на главную.
      // Оставляем текущую логику – перезагружаем страницу товара с новыми данными.
      const productPage = new ProductPage(this.parent, id);
      productPage.render();
    } catch (error) {
      console.error(error);
      alert('Ошибка обновления');
    }
  }
  onCancel() {
    // Возврат на главную страницу
    const mainPage = new MainPage(this.parent);
    mainPage.render();
  }
}