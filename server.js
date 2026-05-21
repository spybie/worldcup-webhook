const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/hook', (req, res) => {
    const command = req.body?.request?.command || '';
    
    let responseText = '';
    
    if (command === 'помощь') {
        responseText = 'Доступные команды: группа A, группа B, лучшие третьи, сетка, сбросить всё';
    }
    else if (command === 'группа A') {
        responseText = 'Открываю группу A. Используйте интерфейс для расстановки мест.';
    }
    else if (command === 'группа B') {
        responseText = 'Открываю группу B. Используйте интерфейс для расстановки мест.';
    }
    else if (command === 'лучшие третьи') {
        responseText = 'Перехожу к выбору лучших третьих мест. Выберите 8 команд на экране.';
    }
    else if (command === 'сетка') {
        responseText = 'Перехожу к сетке плей-офф. Кликайте на команды, чтобы выбирать победителей.';
    }
    else if (command === 'сбросить всё') {
        responseText = 'Сбрасываю все данные. Начинайте заново.';
    }
    else {
        responseText = 'Чемпионат мира 2026. Скажите "помощь" для списка команд.';
    }
    
    res.json({
        version: '1.0',
        session: req.body?.session || { new: false },
        response: {
            text: responseText,
            tts: responseText,
            end_session: false
        }
    });
});

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Webhook is ready' });
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Вебхук: /api/hook`);
});
