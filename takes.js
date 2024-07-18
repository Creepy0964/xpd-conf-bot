const utils = require('./utils');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(utils.utils.token_takes, {polling: true});

const version = fs.readFileSync('version.txt', 'utf-8').slice(0, -1);

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Добро пожаловать в бота ASPD confession! Чтобы отправить тейк, напишите сюда его. К отправке принимаются: текст, видео, фото, аудио, голосовые сообщения.`);
});

bot.onText(/\/info/, (msg) => {
    bot.sendMessage(msg.chat.id, `Чтобы отправить тейк, напишите текст и/или прикрепите медиа. Важно: если Вы хотите, чтобы ваш тейк был неанонимным, подпишите в конце текста тейка что-то по типу "неанон [ник]", к примеру: "неанон крипи".\n\nВерсия ботов: ${version}@master. По всем вопросам обращаться к @hopeeater`);
});

bot.on('message', (msg) => {
    if(msg.text == '/start' || msg.text == '/info') return;
    if(msg.chat.type != 'private') return;
    if(msg.text) {
        bot.sendMessage(-1002249581112, `Новый тейк от ${msg.from.username != undefined ? `@${msg.from.username}` : `id: ${msg.from.id}`}: \n\n\`${msg.text}\n\n#тейк | @aspdcnf_takes_bot | @aspdcnf\``, {parse_mode: 'MarkdownV2'});
    }
    else if(msg.audio || msg.video || msg.voice || msg.photo) {
        bot.sendMessage(-1002249581112, `Новый тейк от ${msg.from.username != undefined ? `@${msg.from.username}` : `id: ${msg.from.id}`}`);
        bot.copyMessage(-1002249581112, msg.from.id, msg.message_id, {caption: `\`${msg.caption != undefined ? `${msg.caption}` : ``}\n\n#тейк | @aspdcnf_takes_bot | @aspdcnf\``, parse_mode: 'MarkdownV2'});
    }
    else if(msg.sticker) {
        console.log('sticker, exiting...');
    }
    bot.sendMessage(msg.chat.id, `Тейк доставлен!`);
    console.log(`message recieved from ${msg.chat.id} by ${msg.from.id}. text: ${msg.text}`);
});

bot.on('edited_message', (msg) => {
    if(msg.chat.type != 'private') return;
    if(msg.text) {
        bot.sendMessage(-1002249581112, `Обновленный тейк от ${msg.from.username != undefined ? `@${msg.from.username}` : `id: ${msg.from.id}`}: \n\n\`${msg.text}\n\n#тейк | @aspdcnf_bot | @aspdcnf\``, {parse_mode: 'MarkdownV2'});
    }
    else if(msg.audio || msg.video || msg.voice || msg.photo) {
        bot.sendMessage(-1002249581112, `Обновленный тейк от ${msg.from.username != undefined ? `@${msg.from.username}` : `id: ${msg.from.id}`}`);
        bot.copyMessage(-1002249581112, msg.chat.id, msg.message_id, {caption: `\`${msg.caption != undefined ? `${msg.caption}` : ``}\n\n#тейк | @aspdcnf_bot | @aspdcnf\``, parse_mode: 'MarkdownV2'});
    }
    bot.sendMessage(msg.chat.id, `Изменения в тейк доставлены!`);
    console.log(`message updated from ${msg.chat.id} by ${msg.from.id}. text: ${msg.text}`);
});

bot.on('polling_error', (err) => {
    console.log(err);
});