const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- ЭТО ГЛАВНАЯ ЛОГИКА, КОТОРАЯ БУДЕТ ПРАВИЛЬНО ОТВЕЧАТЬ ---
app.post('/api/hook', (req, res) => {
    console.log('➡️ Получена команда:', req.body?.request?.command);

    // Извлекаем команду пользователя
    const command = (req.body?.request?.command || req.body?.command || '').toLowerCase();
    const session = req.body?.session || { new: false };
    let responseText = '';

    // --- ПРАВИЛЬНАЯ ОБРАБОТКА КОМАНД ---
    if (command.includes('помощь')) {
        responseText = 'Доступные команды: "группа A", "группа B", "лучшие третьи", "сетка", "сбросить всё"';
    }
    else if (command.includes('группа a')) {
        responseText = 'Открываю группу A. Используйте интерфейс для расстановки мест.';
    }
    else if (command.includes('группа b')) {
        responseText = 'Открываю группу B. Используйте интерфейс для расстановки мест.';
    }
    else if (command.includes('группа')) {
        responseText = 'Назовите группу от A до L. Например: "группа A"';
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
    // ---------------------------------------------

    console.log(`✅ Ответ: ${responseText}`);
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
// -----------------------------------------------------

// Простой ответ для проверки работы сервера в браузере
app.get('/', (req, res) => {
    res.send('Webhook server is running');
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Вебхук: https://worldcup-webhook.onrender.com/api/hook`);
});
