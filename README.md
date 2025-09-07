# 🎫 Certificate Generator - Автоматические сертификаты для бизнеса

Простая система для автоматического создания и отправки подарочных сертификатов в PDF формате через Tilda формы.

## 🎯 Что это делает

1. **Клиент заполняет форму** на Tilda → 
2. **Система создает PDF** с данными клиента → 
3. **Отправляет на email** автоматически → 
4. **Логирует в Google Sheets** для учета

## 🚀 Возможности

- ✅ Генерация PDF сертификатов из шаблонов
- ✅ Автоматическая отправка по email
- ✅ Интеграция с Tilda формами
- ✅ Логирование в Google Sheets
- ✅ Проверка подлинности сертификатов
- ✅ Простая админ-панель
- ✅ Легкое дублирование под новых клиентов

## 📋 Что вам понадобится

- 💻 Компьютер с интернетом
- 📧 Gmail аккаунт
- 🌐 Аккаунт GitHub (бесплатно)
- 🚂 Аккаунт Railway.app (бесплатно)
- 📝 Аккаунт Tilda
- 🎨 PDF шаблон сертификата от клиента

## 📖 Инструкции (для новичков)

### 🎓 Полная пошаговая инструкция
👉 **[ПОШАГОВАЯ-ИНСТРУКЦИЯ.md](ПОШАГОВАЯ-ИНСТРУКЦИЯ.md)** - для тех кто делает это впервые

### ⚙️ Настройка под клиента  
👉 **[НАСТРОЙКА-КЛИЕНТА.md](НАСТРОЙКА-КЛИЕНТА.md)** - как быстро настроить под нового клиента

### 🚀 Деплой на сервер
👉 **[ДЕПЛОЙ-НА-СЕРВЕР.md](ДЕПЛОЙ-НА-СЕРВЕР.md)** - как загрузить на Railway и настроить Tilda

## 🏃‍♂️ Быстрый старт (для опытных)

```bash
# 1. Установите зависимости
npm install

# 2. Запустите интерактивную настройку
npm run setup

# 3. Создайте тестовый шаблон (опционально)
npm run create-template

# 4. Запустите локально
npm start

# 5. Протестируйте систему
npm test
```

## 🎯 Демонстрация для клиента

Когда система готова, вы можете показать клиенту:

1. **Форму в Tilda** - клиент заполняет данные
2. **Мгновенный результат** - PDF приходит на email за секунды
3. **Админ-панель** - статистика и управление
4. **Проверку сертификата** - по QR коду или ссылке

## 🔄 Масштабирование под клиентов

Для каждого нового клиента:
1. Скопируйте проект в новую папку
2. Запустите `npm run setup` 
3. Настройте под клиента
4. Деплойте на отдельный домен
5. Готово! 🎉

### 2. Настройка переменных окружения

Скопируйте `env.example` в `.env` и заполните настройки:

```bash
cp env.example .env
```

Обязательные настройки:
```env
# Основные
PORT=3000
API_KEY=your-super-secret-api-key

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM_NAME=Ваша компания

# База URL (для ссылок в письмах)
BASE_URL=http://localhost:3000
```

### 3. Настройка Gmail

1. Включите двухфакторную аутентификацию в Gmail
2. Создайте пароль приложения:
   - Зайдите в настройки Google аккаунта
   - Безопасность → Пароли приложений
   - Создайте пароль для "Почта"
   - Используйте этот пароль в `EMAIL_PASS`

### 4. Настройка Google Sheets (опционально)

1. Создайте проект в [Google Cloud Console](https://console.cloud.google.com)
2. Включите Google Sheets API
3. Создайте сервисный аккаунт
4. Скачайте JSON ключ
5. Добавьте в `.env`:
   ```env
   GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEETS_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
   GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
   ```
6. Дайте доступ сервисному аккаунту к вашей Google таблице

### 5. Запуск

```bash
# Разработка
npm run dev

# Продакшн
npm start
```

Сервер запустится на `http://localhost:3000`

## 📖 Использование

### Админ-панель

Откройте `http://localhost:3000/admin`
- Логин: `admin`
- Пароль: `password` (можно изменить в `.env`)

### API для создания сертификата

```bash
curl -X POST http://localhost:3000/api/v1/certificates \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "test-template-001",
    "first_name": "Иван",
    "last_name": "Иванов",
    "recipient_email": "ivan@example.com",
    "amount": 5000,
    "message": "С днём рождения!"
  }'
```

### Проверка сертификата (публичная)

```bash
curl http://localhost:3000/api/v1/verify/CERT-CODE
```

## 🎨 Работа с шаблонами

### Загрузка шаблона

```bash
curl -X POST http://localhost:3000/api/v1/templates \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "template=@certificate-template.pdf" \
  -F "name=Мой шаблон" \
  -F 'field_mapping={"first_name":{"x":300,"y":400,"fontSize":24,"color":"#000000"}}'
```

### Настройка полей (field_mapping)

```json
{
  "first_name": {
    "x": 300,        // Позиция X
    "y": 400,        // Позиция Y (от верха)
    "fontSize": 24,  // Размер шрифта
    "color": "#000000" // Цвет в HEX
  },
  "amount": {
    "x": 400,
    "y": 300,
    "fontSize": 20,
    "color": "#ff0000"
  }
}
```

## 🔗 Интеграция с Tilda

1. В Tilda создайте форму с полями:
   - `Name` (имя)
   - `Surname` (фамилия)
   - `Email` (email)
   - `Sum` (сумма)

2. Настройте Webhook:
   - URL: `https://your-server.com/api/v1/certificates`
   - Метод: POST
   - Заголовки: `Authorization: Bearer YOUR_API_KEY`

3. Добавьте скрытое поле `template_id` со значением ID вашего шаблона

## 🚀 Деплой

### Railway (рекомендуется)

1. Создайте аккаунт на [Railway.app](https://railway.app)
2. Подключите GitHub репозиторий
3. Добавьте переменные окружения
4. Деплой произойдет автоматически

### Render

1. Создайте аккаунт на [Render.com](https://render.com)
2. Создайте новый Web Service из GitHub
3. Настройки:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Добавьте переменные окружения

### Обычный VPS

```bash
# Клонируйте на сервер
git clone <your-repo>
cd certificate-generator

# Установите зависимости
npm install

# Настройте .env файл
nano .env

# Запустите с PM2
npm install -g pm2
pm2 start server.js --name certificate-generator
pm2 startup
pm2 save
```

## 📁 Структура проекта

```
certificate-generator/
├── database/           # База данных SQLite
├── middleware/         # Middleware (аутентификация)
├── routes/            # API маршруты
├── services/          # Бизнес-логика (PDF, Email, Sheets)
├── public/            # Статические файлы
├── templates/         # Загруженные шаблоны
├── server.js          # Главный файл сервера
├── package.json       # Зависимости
└── README.md         # Документация
```

## 🐛 Устранение проблем

### Ошибки email
- Проверьте правильность пароля приложения Gmail
- Убедитесь что включена двухфакторная аутентификация

### Ошибки Google Sheets
- Проверьте права доступа сервисного аккаунта к таблице
- Убедитесь что API включен в Google Cloud Console

### Ошибки генерации PDF
- Проверьте что файл шаблона существует
- Убедитесь что field_mapping корректный JSON

## 🔧 Разработка

```bash
# Запуск в режиме разработки
npm run dev

# Проверка здоровья системы
curl http://localhost:3000/health

# Логи
tail -f logs/app.log
```

## 📞 Поддержка

Если возникли вопросы или проблемы:
1. Проверьте логи сервера
2. Убедитесь что все переменные окружения настроены
3. Проверьте статус подключений в админ-панели

## 📄 Лицензия

MIT License
