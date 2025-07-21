# PromiseSync - Solana Wallet Analytics

Веб-приложение для анализа кошельков Solana с интерактивными графиками и детальной статистикой.

## 🚀 Обновление: Миграция на Mobula API

Проект был обновлен для использования **Mobula API** вместо CoinGecko/Moralis для получения криптовалютных данных.

### Преимущества Mobula API:
- 🎯 **Специализация на Solana**: Улучшенная поддержка токенов Solana
- 📊 **Реальные исторические данные**: Точные графики цен
- 🚀 **Высокая производительность**: Быстрые ответы API
- 💎 **300,000 бесплатных запросов** в месяц

## ⚙️ Настройка

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Переменные окружения

Создайте файл `.env` в папке `backend/` на основе `.env.example`:

```env
# Solana RPC URL
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Mobula API Key
MOBULA_API_KEY=your_mobula_api_key_here
```

### 3. Получение API ключа Mobula

1. Зарегистрируйтесь на [Mobula Dashboard](https://admin.mobula.fi/)
2. Создайте новый API ключ
3. Скопируйте ключ в файл `.env`

### 4. Тестирование API

```bash
cd backend
node test-mobula.js
```

### 5. Запуск сервера

```bash
cd backend
node main.js
```

### 6. Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 📚 API Endpoints

### Основные эндпоинты:

- `GET /checkAccount?address=YOUR_SOL_ADDRESS` - Информация о кошельке
- `GET /history?address=YOUR_SOL_ADDRESS` - История балансов  
- `GET /tokens?address=YOUR_SOL_ADDRESS` - Токены и NFT
- `GET /tokengraph?address=TOKEN_ADDRESS` - График цены токена
- `GET /accountnft?address=YOUR_SOL_ADDRESS` - NFT коллекция

### Изменения в API:

**Эндпоинт `/tokengraph`** теперь поддерживает:
- Адреса токенов Solana: `/tokengraph?address=So11111111111111111111111111111111111111112`
- Названия активов: `/tokengraph?address=solana`

## 🏗️ Архитектура

```
PromiseSync/
├── backend/          # Node.js API сервер
│   ├── main.js       # Основной файл сервера
│   ├── test-mobula.js # Тест Mobula API
│   └── .env.example  # Пример переменных окружения
├── frontend/         # React приложение
│   ├── src/
│   │   ├── components/
│   │   ├── redux/
│   │   └── api/
└── landing/          # Лендинг страница
```

## 🔧 Технологии

### Backend:
- **Node.js** + Express
- **Mobula API** - криптовалютные данные
- **Solana Web3.js** - взаимодействие с блокчейном
- **Metaplex** - NFT метаданные

### Frontend:
- **React**
- **Redux** - управление состоянием
- **Chart.js** - интерактивные графики

## 📈 Функции

- 📊 **Анализ кошелька**: Баланс, токены, NFT
- 📈 **Интерактивные графики**: История цен и балансов
- 🎨 **NFT галерея**: Просмотр коллекций
- 💰 **Калькуляция стоимости**: Автоматический расчет в USD
- ⚡ **Реальное время**: Актуальные данные

## 🛠️ Разработка

### Структура проекта:
- `backend/main.js` - основной API сервер
- `backend/MOBULA_MIGRATION.md` - документация миграции
- `frontend/src/` - React компоненты
- `frontend/src/redux/` - Redux store

### Полезные команды:

```bash
# Установка зависимостей
npm install

# Тестирование Mobula API
node test-mobula.js

# Запуск в режиме разработки
npm run dev

# Проверка кода
npm run lint
```

## 📝 Миграция

Подробная информация о миграции с предыдущих API находится в файле `backend/MOBULA_MIGRATION.md`.

## 📞 Поддержка

- 📧 **Email**: support@promisesync.com
- 💬 **Telegram**: [@MobulaPartnerBot](https://t.me/MobulaPartnerBot)
- 📖 **Документация**: [Mobula Docs](https://docs.mobula.io/)

## 📄 Лицензия

MIT License - детали в файле LICENSE.
