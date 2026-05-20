import { ajax } from '../../modules/ajax.js';
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
    loadData() {
        ajax.get(stockUrls.getStockById(this.id), (data, status) => {
            if (status === 200 && data) {
                this.renderProduct(data);
            } else {
                this.pageRoot.innerHTML += '<div class="error">Карточка не найдена</div>';
            }
        });
    }
    renderProduct(stock) {
        const container = this.pageRoot;
        const fullComp = new ProductFullComponent(container);
        fullComp.render(stock,
            () => this.onDelete(stock.id),
            (e) => this.onUpdate(e, stock.id)
        );
    }
    onDelete(id) {
        if (!confirm('Удалить акцию?')) return;
        ajax.delete(stockUrls.deleteStock(id), (data, status) => {
            if (status === 204) {
                const mainPage = new MainPage(this.parent);
                mainPage.render();
            } else {
                alert('Ошибка удаления');
            }
        });
    }
    onUpdate(e, id) {
        e.preventDefault();
        const title = document.getElementById('edit-title').value.trim();
        const src = document.getElementById('edit-src').value.trim();
        const text = document.getElementById('edit-text').value.trim();
        if (!title || !src || !text) {
            alert('Заполните все поля');
            return;
        }
        ajax.patch(stockUrls.updateStock(id), { title, src, text }, (data, status) => {
            if (status === 200) {
                const productPage = new ProductPage(this.parent, id);
                productPage.render();
            } else {
                alert('Ошибка обновления');
            }
        });
    }
}