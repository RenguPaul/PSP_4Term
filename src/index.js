const express = require('express');
const path = require('path');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;

// Путь к файлу данных
const DATA_FILE_PATH = path.join(__dirname, 'data', 'stocks.json');
stocksService.init(DATA_FILE_PATH);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Логирование
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API маршруты
app.use('/api/stocks', stocksRouter);

// 404 для API (без использования '*')
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API маршрут не найден' });
    }
    next();
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});