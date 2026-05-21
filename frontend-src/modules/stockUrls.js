class StockUrls {
  constructor() {
    this.baseUrl = ''; // пустой, так как запросы на тот же origin
  }
  getStocks(title = '') {
    let url = `/api/stocks`;
    if (title) url += `?title=${encodeURIComponent(title)}`;
    return url;
  }
  getStockById(id) {
    return `/api/stocks/${id}`;
  }
  createStock() {
    return `/api/stocks`;
  }
  deleteStock(id) {
    return `/api/stocks/${id}`;
  }
  updateStock(id) {
    return `/api/stocks/${id}`;
  }
}
export const stockUrls = new StockUrls();