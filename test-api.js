#!/usr/bin/env node

/**
 * Простой скрипт для тестирования API Certificate Generator
 * Использование: node test-api.js [base-url] [api-key]
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Параметры по умолчанию
const BASE_URL = process.argv[2] || 'http://localhost:3000';
const API_KEY = process.argv[3] || 'your-secret-api-key-here';

console.log('🧪 Тестирование Certificate Generator API');
console.log('📍 URL:', BASE_URL);
console.log('🔑 API Key:', API_KEY.substring(0, 8) + '...');
console.log('');

// Утилита для HTTP запросов
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Тесты
async function runTests() {
  console.log('1️⃣  Проверка здоровья сервера...');
  try {
    const health = await makeRequest(`${BASE_URL}/health`);
    if (health.status === 200) {
      console.log('✅ Сервер работает');
      console.log('   Uptime:', Math.round(health.data.uptime), 'секунд');
    } else {
      console.log('❌ Сервер не отвечает:', health.status);
      return;
    }
  } catch (error) {
    console.log('❌ Ошибка подключения к серверу:', error.message);
    return;
  }

  console.log('');
  console.log('2️⃣  Проверка API документации...');
  try {
    const docs = await makeRequest(`${BASE_URL}/`);
    if (docs.status === 200) {
      console.log('✅ API документация доступна');
      console.log('   Версия:', docs.data.version);
    }
  } catch (error) {
    console.log('⚠️  Ошибка получения документации:', error.message);
  }

  console.log('');
  console.log('3️⃣  Проверка аутентификации...');
  try {
    const templates = await makeRequest(`${BASE_URL}/api/v1/templates`);
    if (templates.status === 200) {
      console.log('✅ Аутентификация работает');
      console.log('   Шаблонов найдено:', templates.data.templates?.length || 0);
    } else if (templates.status === 401 || templates.status === 403) {
      console.log('❌ Ошибка аутентификации - проверьте API_KEY');
      return;
    } else {
      console.log('⚠️  Неожиданный ответ:', templates.status);
    }
  } catch (error) {
    console.log('❌ Ошибка проверки аутентификации:', error.message);
    return;
  }

  console.log('');
  console.log('4️⃣  Тестирование создания сертификата...');
  
  const testCertificate = {
    template_id: 'test-template-001',
    first_name: 'Тест',
    last_name: 'Тестов',
    recipient_email: 'test@example.com',
    amount: 1000,
    message: 'Тестовый сертификат',
    from_name: 'Тестовая компания'
  };

  try {
    const result = await makeRequest(`${BASE_URL}/api/v1/certificates`, {
      method: 'POST',
      body: testCertificate
    });

    if (result.status === 201) {
      console.log('✅ Сертификат создан успешно');
      console.log('   ID:', result.data.certificate_id);
      console.log('   PDF URL:', result.data.pdf_url);
      console.log('   Проверка:', result.data.verification_url);

      // Тестируем получение сертификата
      console.log('');
      console.log('5️⃣  Проверка получения сертификата...');
      
      const getCert = await makeRequest(`${BASE_URL}/api/v1/certificates/${result.data.certificate_id}`);
      if (getCert.status === 200) {
        console.log('✅ Сертификат найден');
        console.log('   Получатель:', getCert.data.first_name, getCert.data.last_name);
        console.log('   Статус:', getCert.data.status);
      } else {
        console.log('⚠️  Ошибка получения сертификата:', getCert.status);
      }

    } else if (result.status === 422) {
      console.log('❌ Ошибка валидации данных');
      console.log('   Детали:', result.data.details);
    } else {
      console.log('❌ Ошибка создания сертификата:', result.status);
      console.log('   Ответ:', result.data);
    }
  } catch (error) {
    console.log('❌ Ошибка тестирования создания сертификата:', error.message);
  }

  console.log('');
  console.log('6️⃣  Тестирование публичной проверки...');
  
  try {
    // Тестируем с несуществующим кодом
    const verify = await makeRequest(`${BASE_URL}/api/v1/verify/FAKE-CODE-123`, {
      headers: {} // Убираем Authorization для публичного endpoint
    });
    
    if (verify.status === 404) {
      console.log('✅ Публичная проверка работает (несуществующий код корректно обрабатывается)');
    } else {
      console.log('⚠️  Неожиданный ответ публичной проверки:', verify.status);
    }
  } catch (error) {
    console.log('❌ Ошибка тестирования публичной проверки:', error.message);
  }

  console.log('');
  console.log('🎉 Тестирование завершено!');
  console.log('');
  console.log('📋 Следующие шаги:');
  console.log('1. Откройте админ-панель:', `${BASE_URL}/admin`);
  console.log('2. Загрузите свой шаблон PDF');
  console.log('3. Настройте интеграцию с Tilda');
  console.log('4. Проверьте настройки email и Google Sheets в админке');
}

// Запуск тестов
runTests().catch(console.error);
