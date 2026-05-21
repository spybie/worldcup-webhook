const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем CORS и парсинг JSON
app.use(cors());
app.use(express.json());

// Обработчик ВСЕХ голосовых команд
app.post('/api/hook', (req, res) => {
    // Извлекаем команду пользователя из запроса Сбера
    const command = req.body?.request?.command || req.body?.command || '';
    const session = req.body?.session || { new: false };
    
    let responseText = '';

    // --- Логика обработки команд ---
    if (command.includes('помощь')) {
        responseText = 'Доступные команды: "группа A", "группа B", "лучшие третьи", "сетка", "сбросить всё"';
    }
    else if (command.match(/группа [a-l]/i)) {
        const groupLetter = command.match(/группа ([a-l])/i)[1].toUpperCase();
        responseText = `Открываю группу ${groupLetter}. Используйте интерфейс для расстановки мест.`;
    }
    else if (command.includes('лучшие третьи')) {
        responseText = 'Перехожу к выбору лучших третьих мест. Выберите 8 команд на экране.';
    }
    else if (command.includes('сетка') || command.includes('плей-офф')) {
        responseText = 'Перехожу к сетке плей-офф. Кликайте на команды, чтобы выбирать победителей.';
    }
    else if (command.includes('сбросить')) {
        responseText = 'Сбрасываю все данные. Начинайте заново.';
    }
    else {
        responseText = 'Чемпионат мира 2026. Скажите "помощь" для списка команд.';
    }
    // ---------------------------------

    // Отправляем ответ обратно ассистенту Сбера
    res.json({
        version: '1.0',
        session: session,
        response: {
            text: responseText,
            tts: responseText,
            end_session: false
        }
    });
});

// Простой ответ на корневой путь, чтобы проверить, что сервер жив
app.get('/', (req, res) => {
    res.send('Webhook server is running');
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Вебхук доступен по адресу: /api/hook`);
});
