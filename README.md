# Лабораторная работа №6

## Оглавление

1. [Цель лабораторной работы](#1-цель-лабораторной-работы)
2. [Часть 1. Замена XMLHttpRequest на fetch](#2-часть-1-замена-xmlhttprequest-на-fetch)
3. [Часть 2. Сборка клиентской части через Vite](#3-часть-2-сборка-клиентской-части-через-vite)
4. [Часть 3. Раздача статики с бэкенда](#4-часть-3-раздача-статики-с-бэкенда)
5. [Скриншоты работающего приложения](#5-скриншоты-работающего-приложения)
6. [Итоговая структура проекта](#6-итоговая-структура-проекта)
7. [Вывод](#7-вывод)


## 1. Цель лабораторной работы

Лабораторная работа состоит из двух частей:

**Часть 1.** Замена механизма взаимодействия с API: в прошлой лабораторной работе использовался XMLHttpRequest, в этой - современный метод fetch с использованием промисов и async/await.

**Часть 2.** Сборка клиентской части приложения с помощью системы сборки Vite и раздача фронтенда в качестве статики с бэкенда для устранения проблем с CORS.


## 2. Часть 1. Замена XMLHttpRequest на fetch

В 5 лабораторной работе использовался XMLHttpRequest через самописный модуль ajax.js.

**Файл modules/ajax.js (удален):**

```javascript
class Ajax {
    get(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
                callback(data, xhr.status);
            }
        };
    }
    post(url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
                callback(data, xhr.status);
            }
        };
    }
    patch(url, data, callback) { /* аналогично */ }
    delete(url, callback) { /* аналогично */ }
}
export const ajax = new Ajax();

**Файл modules/sessionsUrls.js (удален):**

```javascript
export class SessionsUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getSessions() {
        return `${this.baseUrl}/sessions`;
    }

    getSessionById(id) {
        return `${this.baseUrl}/sessions/${id}`;
    }
}

export const sessionsUrls = new SessionsUrls();
```

**Использование в pages/main/index.js (5 лаба):**

```javascript
import { ajax } from "../../modules/ajax.js";
import { sessionsUrls } from "../../modules/sessionsUrls.js";

getData() {
    ajax.get(sessionsUrls.getSessions(), (data, status) => {
        if (status === 200 && data) {
            this.sessions = data;
            this.renderCards();
        }
    });
}
```

В 6 лабораторной работе используется встроенная функция fetch с async/await, а файлы ajax.js и sessionsUrls.js удалены.

**Файл pages/main/index.js (6 лаба):**

```javascript
async getData() {
    this.showDebugMessage('Загрузка данных с сервера (fetch)...');

    try {
        const url = '/sessions';
        this.showDebugMessage(`Запрос к: ${url}`);

        const response = await fetch(url);
        this.showDebugMessage(`Статус ответа: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }

        const data = await response.json();
        this.showDebugMessage(`Получено сеансов: ${data.length}`);
        this.sessions = data;
        this.renderCards();

    } catch (error) {
        const errorMsg = `Ошибка: ${error.message}`;
        this.showDebugMessage(errorMsg, true);
        console.error('Ошибка загрузки:', error);
    }
}
```

**Файл pages/product/index.js (6 лаба):**

```javascript
async getData() {
    try {
        const response = await fetch(`/sessions/${this.id}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Сеанс не найден');
            }
            throw new Error(`HTTP ошибка: ${response.status}`);
        }

        this.session = await response.json();
        this.renderProduct();

    } catch (error) {
        console.error('Ошибка загрузки:', error);
        const container = this.pageRoot;
        if (container) {
            container.innerHTML += `<div class="alert alert-danger">${error.message}</div>`;
        }
    }
}
```

**Ключевые отличия fetch от XMLHttpRequest:**

| Характеристика | XMLHttpRequest (5 лаба) | fetch (6 лаба) |
|----------------|--------------------------|----------------|
| Необходимость отдельного файла | Да (ajax.js) | Нет (встроен в браузер) |
| Необходимость хранения URL | Да (sessionsUrls.js) | Нет (относительные пути) |
| Обработка ответа | Коллбеки (callback) | Промисы / async await |
| Парсинг JSON | Вручную JSON.parse() | Автоматически response.json() |
| Обработка ошибок | Проверка status в коллбеке | try/catch |

---

## 3. Часть 2. Сборка клиентской части через Vite

**Установка Vite:**

```bash
cd frontend-src
npm install -D vite
```

**Файл vite.config.js:**

```javascript
export default {
    build: {
        outDir: '../public',
        emptyOutDir: true,
    },
};
```

**Файл package.json (измененная часть):**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

**Команды для работы:**

| Команда | Назначение |
|---------|------------|
| npm run dev | Запуск dev сервера для разработки (порт 5173) |
| npm run build | Сборка проекта в папку public |
| npm run preview | Предпросмотр собранного проекта |

---


**Процесс сборки и раздачи:**

```bash
# 1. Собрать фронтенд
cd frontend-src
npm run build

# 2. Убедиться, что папка ../public создана и содержит index.html
ls ../public

# 3. Запустить бэкенд из корня проекта
cd ..
npm run dev   # (или npm start)
```

**Результат:** Фронтенд доступен по адресу http://localhost:3000 (на том же порту, что и API). CORS больше не требуется.



## 5. Итоговая структура проекта

```
lab6-kubernetes-stocks/
├── src/                     # бэкенд Express (ЛР4)
│   ├── data/
│   │   └── stocks.json
│   ├── services/
│   │   ├── fileService.js
│   │   └── stocksService.js
│   ├── controllers/
│   │   └── stocksController.js
│   ├── routes/
│   │   └── stocks.js
│   └── index.js
├── public/                  # собранный фронтенд (создаётся Vite)
│   ├── index.html
│   ├── style.css
│   └── assets/
│       └── index-abc123.js
├── frontend-src/            # исходники фронтенда (Vite проект)
│   ├── components/
│   │   ├── back-button/
│   │   │   └── index.js
│   │   ├── product-card/
│   │   │   └── index.js
│   │   └── product-full/
│   │       └── index.js
│   ├── pages/
│   │   ├── main/
│   │   │   └── index.js
│   │   └── product/
│   │       └── index.js
│   ├── modules/
│   │   ├── api.js
│   │   └── stockUrls.js      # (не используется, но оставлен для совместимости)
│   ├── index.html
│   ├── main.js
│   ├── style.css
│   ├── package.json
│   └── vite.config.js
├── package.json
└── .gitignore
```

## 6. Вывод

В ходе выполнения лабораторной работы №6:

1. Заменили устаревший XMLHttpRequest на современный fetch с использованием промисов и async/await.

2. Удалили вспомогательные файлы ajax.js и sessionsUrls.js, так как fetch является встроенной функцией браузера и не требует оберток.

3. Настроили сборка клиентской части с помощью Vite.

4. Настроена раздача собранного фронтенда в качестве статики с бэкенда, что позволило избавиться от проблем с CORS.

5. Фронтенд и бэкенд теперь работают на одном порту (3000), что является правильной практикой для production окружения.