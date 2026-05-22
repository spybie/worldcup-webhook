const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Выносим общую логику обработки текста
function processCommand(textInput, sessionId) {
    const command = textInput || '';
    
    console.log(`[LOG] Обработка команды: ${command}`);
    
    let replyText = '';
    const lowerCommand = command.toLowerCase();
    
    // Группы A-L
    const groupMatch = lowerCommand.match(/группа\s+([a-l])/i);
    if (groupMatch) {
        const groupLetter = groupMatch[1].toUpperCase();
        replyText = `Открываю группу ${groupLetter}. Используйте интерфейс для расстановки мест.`;
    }
    // Лучшие третьи
    else if (lowerCommand.includes('лучшие третьи')) {
        replyText = 'Перехожу к выбору лучших третьих мест. Выберите 8 команд на экране.';
    }
    // Сетка плей-офф
    else if (lowerCommand.includes('сетка') || lowerCommand.includes('плей-офф')) {
        replyText = 'Перехожу к сетке плей-офф. Кликайте на команды, чтобы выбирать победителей.';
    }
    // Сброс
    else if (lowerCommand.includes('сбросить') || lowerCommand.includes('начать заново')) {
        replyText = 'Сбрасываю все данные. Начинайте заново.';
    }
    // Помощь
    else if (lowerCommand === 'помощь' || lowerCommand === 'help') {
        replyText = 'Доступные команды: группа A, группа B, лучшие третьи, сетка плей-офф, сбросить всё';
    }
    // Неизвестная команда
    else {
        replyText = 'Чемпионат мира 2026. Скажите "помощь" для списка доступных команд.';
    }

    // Формируем строго валидный ответ для SaluteBot API (Сбер)
    return {
        messageName: "ANSWER_TO_USER",
        payload: {
            answers: [
                {
                    type: "text",
                    text: replyText,
                    tts: replyText
                }
            ],
            backend_data: JSON.stringify({
                command: command,
                action: 'update_frontend'
            })
        },
        sessionId: sessionId,
        uuid: {
            userId: "user_id"
        }
    };
}

// === ОБРАБОТЧИК ВЕБХУКА ДЛЯ СБЕРА ===
app.post('/api/hook', (req, res) => {
    const incomingText = req.body?.payload?.message?.original_text || req.body?.payload?.intent || '';
    const sessionId = req.body?.sessionId || '';
    const userId = req.body?.uuid?.userId || 'default_user';

    console.log(`[HOOK] Получен текст: "${incomingText}"`);

    const responseJson = processCommand(incomingText, sessionId);
    responseJson.uuid.userId = userId;

    res.json(responseJson);
});

// === ДОПОЛНИТЕЛЬНЫЙ ЭНДПОИНТ ДЛЯ ГОЛОСА ===
app.post('/api/voice', (req, res) => {
    const incomingText = req.body?.text || '';
    const sessionId = req.body?.sessionId || 'voice_session';

    console.log(`[VOICE] Входящий текст: "${incomingText}"`);
    
    const responseJson = processCommand(incomingText, sessionId);
    res.json(responseJson);
});

// Проверка работы сервера
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'ЧМ-2026 вебхук работает корректно под формат Сбера',
        version: '1.1',
        endpoints: ['POST /api/hook', 'POST /api/voice']
    });
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Вебхук для SmartApp: https://worldcup-webhook.onrender.com/api/hook`);
});
