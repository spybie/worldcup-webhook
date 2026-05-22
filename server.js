const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// === ОБРАБОТЧИК ВЕБХУКА ДЛЯ СБЕРА ===
app.post('/api/hook', (req, res) => {
    const { request, session } = req.body;
    const command = request?.command || '';
    const originalUtterance = request?.original_utterance || '';
    
    console.log(`[HOOK] Команда: ${command}`);
    console.log(`[HOOK] Исходная фраза: ${originalUtterance}`);
    
    let reply = {
        text: '',
        tts: ''
    };
    
    // === АНАЛИЗ КОМАНД (как в brokely) ===
    const lowerCommand = command.toLowerCase();
    const lowerUtterance = originalUtterance.toLowerCase();
    
    // Группы A-L
    const groupMatch = lowerCommand.match(/группа\s+([a-l])/i) || lowerUtterance.match(/группа\s+([a-l])/i);
    if (groupMatch) {
        const groupLetter = groupMatch[1].toUpperCase();
        reply.text = `Открываю группу ${groupLetter}. Используйте интерфейс для расстановки мест.`;
        reply.tts = reply.text;
    }
    // Лучшие третьи
    else if (lowerCommand.includes('лучшие третьи') || lowerUtterance.includes('лучшие третьи')) {
        reply.text = 'Перехожу к выбору лучших третьих мест. Выберите 8 команд на экране.';
        reply.tts = reply.text;
    }
    // Сетка плей-офф
    else if (lowerCommand.includes('сетка') || lowerUtterance.includes('сетка') ||
             lowerCommand.includes('плей-офф') || lowerUtterance.includes('плей-офф')) {
        reply.text = 'Перехожу к сетке плей-офф. Кликайте на команды, чтобы выбирать победителей.';
        reply.tts = reply.text;
    }
    // Сброс
    else if (lowerCommand.includes('сбросить') || lowerUtterance.includes('сбросить') ||
             lowerCommand.includes('начать заново') || lowerUtterance.includes('начать заново')) {
        reply.text = 'Сбрасываю все данные. Начинайте заново.';
        reply.tts = reply.text;
    }
    // Помощь
    else if (lowerCommand === 'помощь' || lowerCommand === 'help' || lowerUtterance.includes('помощь')) {
        reply.text = 'Доступные команды: группа A, группа B, лучшие третьи, сетка плей-офф, сбросить всё';
        reply.tts = reply.text;
    }
    // Неизвестная команда
    else {
        reply.text = 'Чемпионат мира 2026. Скажите "помощь" для списка доступных команд.';
        reply.tts = reply.text;
    }
    
    // Формируем ответ для Сбера
    const response = {
        version: '1.0',
        session: session || { new: false },
        response: {
            text: reply.text,
            tts: reply.tts,
            end_session: false
        },
        payload: {
            command: command,
            action: 'update_frontend'
        }
    };
    
    console.log(`[HOOK] Ответ: ${reply.text}`);
    res.json(response);
});

// === ДОПОЛНИТЕЛЬНЫЙ ЭНДПОИНТ ДЛЯ ГОЛОСА (как в brokely) ===
app.post('/api/voice', (req, res) => {
    const { text, session } = req.body;
    console.log(`[VOICE] Распознано: ${text}`);
    
    // Перенаправляем на основной обработчик
    const fakeReq = { body: { request: { command: text, original_utterance: text }, session } };
    const fakeRes = {
        json: (data) => {
            console.log(`[VOICE] Ответ отправлен`);
            res.json(data);
        }
    };
    
    // Вызываем основной обработчик
    app._router.handle(fakeReq, fakeRes, () => {});
});

// Проверка работы сервера
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'ЧМ-2026 вебхук работает',
        version: '1.0',
        endpoints: ['POST /api/hook', 'POST /api/voice']
    });
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Вебхук: http://localhost:${PORT}/api/hook`);
    console.log(`🎤 Голосовой эндпоинт: http://localhost:${PORT}/api/voice`);
});
