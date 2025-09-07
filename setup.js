#!/usr/bin/env node

/**
 * Скрипт первоначальной настройки Certificate Generator
 * Использование: node setup.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🎫 НАСТРОЙКА CERTIFICATE GENERATOR');
  console.log('==================================');
  console.log('');
  console.log('Этот скрипт поможет настроить систему под вашего клиента.');
  console.log('Вы можете пропустить любые настройки нажав Enter.');
  console.log('');

  // Собираем информацию о клиенте
  console.log('📋 ИНФОРМАЦИЯ О КЛИЕНТЕ:');
  const clientName = await question('Название компании клиента: ');
  const clientDescription = await question('Описание услуг (например, "Подарочные сертификаты салона красоты"): ');
  const clientWebsite = await question('Сайт клиента (необязательно): ');

  console.log('');
  console.log('📧 НАСТРОЙКИ EMAIL:');
  const emailAddress = await question('Gmail адрес для отправки сертификатов: ');
  const senderName = clientName || await question('Имя отправителя в письмах: ');

  console.log('');
  console.log('🎨 ШАБЛОН СЕРТИФИКАТА:');
  const templateId = await question('ID шаблона (например, "bella-salon-001"): ');
  const templateName = await question('Название шаблона: ');

  console.log('');
  console.log('🔑 БЕЗОПАСНОСТЬ:');
  const apiKey = await question('API ключ (или оставьте пустым для автогенерации): ') || 
                 `${clientName?.toLowerCase().replace(/\s+/g, '-') || 'client'}-${Date.now()}-secret`;

  console.log('');
  console.log('📊 GOOGLE SHEETS:');
  const useGoogleSheets = (await question('Использовать Google Sheets для логирования? (y/n): ')).toLowerCase() === 'y';

  // Создаем конфигурацию
  const config = {
    client_info: {
      name: clientName || 'Новый клиент',
      description: clientDescription || 'Подарочные сертификаты',
      website: clientWebsite || ''
    },
    email_settings: {
      gmail_address: emailAddress || 'your-gmail@gmail.com',
      gmail_app_password: 'НАСТРОЙТЕ_ПАРОЛЬ_ПРИЛОЖЕНИЯ',
      sender_name: senderName || clientName || 'Certificate Generator',
      subject_template: `Ваш подарочный сертификат на {amount} руб.`
    },
    google_sheets: {
      enabled: useGoogleSheets,
      spreadsheet_id: useGoogleSheets ? 'НАСТРОЙТЕ_ID_ТАБЛИЦЫ' : '',
      service_account_email: useGoogleSheets ? 'НАСТРОЙТЕ_EMAIL_СЕРВИСА' : '',
      private_key: useGoogleSheets ? 'НАСТРОЙТЕ_ПРИВАТНЫЙ_КЛЮЧ' : ''
    },
    certificate_template: {
      template_id: templateId || 'client-template-001',
      template_name: templateName || 'Сертификат клиента',
      pdf_file_path: './templates/client-certificate.pdf',
      field_positions: {
        first_name: { x: 250, y: 515, fontSize: 20, color: '#000000' },
        last_name: { x: 350, y: 515, fontSize: 20, color: '#000000' },
        amount: { x: 275, y: 435, fontSize: 18, color: '#cc9900' },
        issue_date: { x: 180, y: 150, fontSize: 12, color: '#666666' },
        certificate_code: { x: 430, y: 150, fontSize: 10, color: '#666666' },
        message: { x: 100, y: 550, fontSize: 14, color: '#333333', maxWidth: 400 }
      }
    },
    tilda_integration: {
      webhook_url: 'НАСТРОЙТЕ_ПОСЛЕ_ДЕПЛОЯ',
      api_key: apiKey,
      form_fields_mapping: {
        Name: 'first_name',
        Surname: 'last_name',
        Email: 'recipient_email',
        Sum: 'amount',
        Message: 'message'
      }
    },
    certificate_settings: {
      expiry_days: 365,
      default_message: 'Поздравляем с получением подарочного сертификата!',
      verification_enabled: true
    }
  };

  // Сохраняем конфигурацию
  const configPath = path.join(__dirname, 'client-config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

  // Создаем .env файл
  const envContent = `# Основные настройки
NODE_ENV=development
PORT=3000

# API ключи
API_KEY=${apiKey}

# Email настройки (Gmail)
EMAIL_USER=${emailAddress || 'your-gmail@gmail.com'}
EMAIL_PASS=НАСТРОЙТЕ_ПАРОЛЬ_ПРИЛОЖЕНИЯ
EMAIL_FROM_NAME=${senderName || clientName || 'Certificate Generator'}

# Google Sheets (если включено)
${useGoogleSheets ? `GOOGLE_SHEETS_PRIVATE_KEY="НАСТРОЙТЕ_ПРИВАТНЫЙ_КЛЮЧ"
GOOGLE_SHEETS_CLIENT_EMAIL=НАСТРОЙТЕ_EMAIL_СЕРВИСА
GOOGLE_SHEETS_SPREADSHEET_ID=НАСТРОЙТЕ_ID_ТАБЛИЦЫ` : '# Google Sheets отключено'}

# Настройки сертификатов
CERTIFICATE_EXPIRY_DAYS=365
BASE_URL=http://localhost:3000

# Админ панель
ADMIN_USER=admin
ADMIN_PASS=password`;

  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent, 'utf8');

  console.log('');
  console.log('✅ НАСТРОЙКА ЗАВЕРШЕНА!');
  console.log('======================');
  console.log('');
  console.log('📁 Созданные файлы:');
  console.log('  ✅ client-config.json - конфигурация клиента');
  console.log('  ✅ .env - переменные окружения');
  console.log('');
  console.log('📋 СЛЕДУЮЩИЕ ШАГИ:');
  console.log('');
  console.log('1. 📧 НАСТРОЙТЕ GMAIL:');
  console.log('   - Включите двухфакторную аутентификацию');
  console.log('   - Создайте пароль приложения');
  console.log('   - Обновите EMAIL_PASS в .env файле');
  console.log('');
  
  if (useGoogleSheets) {
    console.log('2. 📊 НАСТРОЙТЕ GOOGLE SHEETS:');
    console.log('   - Создайте проект в Google Cloud Console');
    console.log('   - Включите Google Sheets API');
    console.log('   - Создайте сервисный аккаунт');
    console.log('   - Обновите настройки в .env файле');
    console.log('');
  }

  console.log('3. 🎨 ПОДГОТОВЬТЕ ШАБЛОН:');
  console.log('   - Получите PDF шаблон от клиента');
  console.log('   - Сохраните в папку templates/');
  console.log('');
  console.log('4. 🚀 ЗАПУСТИТЕ ЛОКАЛЬНО:');
  console.log('   npm start');
  console.log('');
  console.log('5. 🧪 ПРОТЕСТИРУЙТЕ:');
  console.log('   node quick-test.js');
  console.log('');
  console.log('6. 🌐 ДЕПЛОЙ НА СЕРВЕР:');
  console.log('   Следуйте инструкции в ДЕПЛОЙ-НА-СЕРВЕР.md');
  console.log('');
  console.log('📖 Подробные инструкции:');
  console.log('   - ПОШАГОВАЯ-ИНСТРУКЦИЯ.md - для новичков');
  console.log('   - НАСТРОЙКА-КЛИЕНТА.md - настройка под клиента');
  console.log('   - ДЕПЛОЙ-НА-СЕРВЕР.md - деплой и Tilda');
  console.log('');
  console.log('🎉 Удачи с настройкой!');

  rl.close();
}

// Проверяем существование файлов
const configExists = fs.existsSync(path.join(__dirname, 'client-config.json'));
const envExists = fs.existsSync(path.join(__dirname, '.env'));

if (configExists || envExists) {
  console.log('⚠️  ВНИМАНИЕ: Найдены существующие файлы конфигурации.');
  rl.question('Перезаписать их? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      setup();
    } else {
      console.log('Настройка отменена.');
      rl.close();
    }
  });
} else {
  setup();
}
