const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Удалите эти строки (они не нужны для вебхука):
// app.use(express.static(__dirname));
// app.get('/', (req, res) => { ... });

// Только вебхук
app.post('/api/hook', (req, res) => {
    const { request, session } = req.body;
    const command = request?.command || '';
    
    let responseText = '';
    
    if (command.includes('группа') || command.includes('group')) {
        const groupMatch = command.match(/[A-L]/i);
        if (groupMatch) {
            responseText = `Открываю группу ${groupMatch[0].toUpperCase()}. Используйте интерфейс для расстановки мест.`;
        } else {
            responseText = 'Назовите группу от A до L. Например: "группа A"';
        }
    } 
    else if (command.includes('третьи') || command.includes('лучшие')) {
        responseText = 'Перехожу к выбору лучших третьих мест. Выберите 8 команд на экране.';
    }
    else if (command.includes('сетка') || command.includes('плей-офф')) {
        responseText = 'Перехожу к сетке плей-офф. Кликайте на команды, чтобы выбирать победителей.';
    }
    else if (command.includes('помощь') || command === 'help') {
        responseText = 'Доступные команды: "группа A", "группа B", "лучшие третьи", "сетка", "сбросить всё"';
    }
    else if (command.includes('сбросить')) {
        responseText = 'Сбрасываю все данные. Начинайте заново.';
    }
    else {
        responseText = 'Чемпионат мира 2026. Скажите "помощь" для списка команд.';
    }
    
    res.json({
        version: '1.0',
        session: session || { new: false },
        response: {
            text: responseText,
            tts: responseText,
            end_session: false
        }
    });
});

// Обработка корневого маршрута (просто для проверки)
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Webhook server is running' });
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Вебхук: /api/hook`);
});
