const express = require('express');
const path = require('path');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;

const DATA_FILE_PATH = path.join(__dirname, 'data', 'stocks.json');
stocksService.init(DATA_FILE_PATH);

app.use(express.json());

// Раздача статики из папки public (собранный фронтенд)
app.use(express.static(path.join(__dirname, '..', 'public')));

// API маршруты
app.use('/api/stocks', stocksRouter);

// Все остальные запросы (не API) отдаём index.html для поддержки SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});