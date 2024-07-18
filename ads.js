const utils = require('./utils');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(utils.utils.token_ads, {polling: true});

const version = fs.readFileSync('version.txt', 'utf-8').slice(0, -1);

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Добро пожаловать в бота ASPD confession! Чтобы отправить тейк, напишите сюда его. К отправке принимаются: текст, видео, фото, аудио, голосовые сообщения.`);
});

bot.onText(/\/info/, (msg) => {
    bot.sendMessage(msg.chat.id, `Чтобы отправить запрос на ВП, заполните анкету по примеру из канала.\n\nВерсия ботов: ${version}@master. По всем вопросам обращаться к @creepy0964`);
});

bot.on('message', (msg) => {
    if(msg.text == '/start' || msg.text == '/info') return;
    if(msg.chat.type != 'private') return;
    bot.sendMessage(-1002249581112, `Новый запрос на ВП от ${msg.from.username != undefined ? `@${msg.from.username}` : `id: ${msg.from.id}`}: \n\n\`${msg.text}\n\n#вп | @aspdcnf_ads_bot | @aspdcnf\``, {parse_mode: 'MarkdownV2'});
    bot.sendMessage(msg.chat.id, `Запрос на ВП отправлен!`);
    console.log(`message recieved from ${msg.chat.id} by ${msg.from.id}. text: ${msg.text}`);
});

bot.on('edited_message', (msg) => {
    if(msg.chat.type != 'private') return;
    bot.sendMessage(-1002249581112, `Обновленный запрос на ВП от ${msg.from.username != undefined ? `@${msg.from.username}` : `id: ${msg.from.id}`}: \n\n\`${msg.text}\n\n#вп | @aspdcnf_ads_bot | @aspdcnf\``, {parse_mode: 'MarkdownV2'});
    bot.sendMessage(msg.chat.id, `Изменения в запрос на ВП внесены!`);
    console.log(`message updated from ${msg.chat.id} by ${msg.from.id}. text: ${msg.text}`);
});

bot.on('polling_error', (err) => {
    console.log(err);
});