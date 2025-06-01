import { Composer } from "telegraf";
import { getUserByTId, addUser } from "../model/database.ts";
import { bot, logger } from "../index.ts";

const statuses = ['member', 'administrator', 'creator', 'restricted'];

export const start = Composer.command("start", async (ctx) => {
    if(getUserByTId(ctx.from!.id) != undefined && getUserByTId(ctx.from!.id)!.isBanned == 1) return;
    // if(!ctx.from?.id || !ctx.from?.username) return;

    logger.info(`${ctx.from.id} || ${ctx.from.username} executed /start`);

    bot.telegram.getChatMember(-1002181363757, ctx.from.id).then(async (x) => {
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
})
