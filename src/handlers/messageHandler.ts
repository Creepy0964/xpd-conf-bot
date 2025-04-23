import { Composer, Scenes } from "telegraf";
import { bot, logger } from "../index.ts";
import { TAKES_CHAT, ADS_CHAT, CHANNEL } from "../config/config.ts";
import { getUserByTId, addUser } from "../database/userDatabase.ts";
import { banMW } from "../middlewares/middleware.ts";

export const msgComposer = new Composer();
const statuses = ['member', 'administrator', 'creator', 'restricted'];

msgComposer.command("start", banMW, async (ctx) => {
    if(!ctx.from?.id || !ctx.from?.username) return;

    logger.info(`${ctx.from.id} || ${ctx.from.username} executed /start`);

    bot.telegram.getChatMember(CHANNEL, ctx.from.id).then(async (x) => {
        if(statuses.includes(x.status)) {
            const profile = getUserByTId(ctx.from!.id)
            if(!profile) addUser(ctx.from!);
            await ctx.reply('Добро пожаловать!', {reply_parameters: {message_id: ctx.message.message_id}, reply_markup: {inline_keyboard: [[{text: 'Отправить тейк', callback_data: 'take'}, {text: 'Отправить запрос на ВП', callback_data: 'ads'}], [{text: 'Инфо', callback_data: 'info'}]]}});
        }
        else {
            await ctx.reply('Упс! Для того, чтобы использовать бота, Вы должны быть подписаны на канал.\n\nПосле подписки нажмите /start снова.', {reply_parameters: {message_id: ctx.message.message_id}, reply_markup: {inline_keyboard: [[{text: 'Подписаться', url: 'https://t.me/xpdforum'}]]}});
            return;
        }
    });    
});

msgComposer.on('message', banMW, async (ctx) => {
    if('reply_to_message' in ctx.update.message && ctx.update.message.reply_to_message?.chat.id == (TAKES_CHAT || ADS_CHAT) && ctx.update.message.reply_to_message?.from?.id == (await bot.telegram.getMe()).id) {
        if('text' in ctx.update.message.reply_to_message) {
            let user = ctx.update.message.reply_to_message.text.split(' ');
            await bot.telegram.sendMessage(user[user.includes('ВП:') ? 6 : 4], `Вам ответил администратор!\n\nОтвет: ${ctx.update.message.text!}`);
            await ctx.reply('Ответ отправлен!');
        }
        if('caption' in ctx.update.message.reply_to_message) {
            let user = ctx.update.message.reply_to_message.caption?.split(' ');
            await bot.telegram.sendMessage(user![user!.includes('ВП:') ? 6 : 4], `Вам ответил администратор!\n\nОтвет: ${ctx.update.message.text!}`);
            await ctx.reply('Ответ отправлен!');
        }
        logger.info(`${ctx.from.id} || ${ctx.from.username} replied to take`);
    }
    else {
        if(ctx.message.chat.type == 'private') await ctx.reply(`Извините, но я Вас не понял. Возможно, Вам следует использовать команду /start и попробовать использовать основное меню?`);
    }
});