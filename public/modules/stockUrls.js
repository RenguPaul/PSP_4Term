class StockUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
    }
    getStocks(title = '') {
        let url = `${this.baseUrl}/stocks`;
        if (title) url += `?title=${encodeURIComponent(title)}`;
        return url;
    }
    getStockById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }
    createStock() {
        return `${this.baseUrl}/stocks`;
    }
    deleteStock(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }
    updateStock(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }
}
export const stockUrls = new StockUrls();