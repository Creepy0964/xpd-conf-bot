import { Composer } from "telegraf";
import { bot } from "..";
import { BotUser, getUserByTId } from "../model/database";
import { logger } from "../index.ts";

export const mainAction = Composer.action('main', async (ctx) => {
    if(getUserByTId(ctx.from!.id) != undefined && getUserByTId(ctx.from!.id)!.isBanned == 1) return;
    await ctx.editMessageText('Главное меню', {reply_markup: {inline_keyboard: [[{text: 'Отправить тейк', callback_data: 'take'}, {text: 'Отправить запрос на ВП', callback_data: 'ads'}], [{text: 'Инфо', callback_data: 'info'}]]}});
});

export const infoAction = Composer.action('info', async (ctx) => {
    if(getUserByTId(ctx.from!.id) != undefined && getUserByTId(ctx.from!.id)!.isBanned == 1) return;
    await ctx.editMessageText('XPD Forum Bot\n\nИз самых больших в мире альтруистических побуждений разработано верным IT-слугой — @creepy0964', {reply_markup: {inline_keyboard: [[{text: 'Назад', callback_data: 'main'}]]}});
});

export const acceptTakeAction = Composer.action('acceptTake', async (ctx) => {
    if('text' in ctx.update.callback_query.message!) await bot.telegram.sendMessage(-1002181363757, ctx.update.callback_query.message!.text.split('\n').slice(2).join('\n'));
    if('photo' in ctx.update.callback_query.message!) await bot.telegram.sendPhoto(-1002181363757, ctx.update.callback_query.message!.photo[0].file_id, {caption: ctx.update.callback_query.message!.caption!.split('\n').slice(2).join('\n')});
    if('video' in ctx.update.callback_query.message!) await bot.telegram.sendVideo(-1002181363757, ctx.update.callback_query.message!.video[0].file_id, {caption: ctx.update.callback_query.message!.caption!.split('\n').slice(2).join('\n')});

    logger.info(`${ctx.update.callback_query.from.id} || ${ctx.update.callback_query.from.username} accepted take`);

    await ctx.deleteMessage(ctx.update.callback_query.message!.message_id);
    await ctx.reply('Отправлено!');
});

export const banUserAction = Composer.action('banUser', async (ctx) => {
    logger.info(`${ctx.update.callback_query.from.id} || ${ctx.update.callback_query.from.username} tried to ban a user`);
    await ctx.sendMessage(`Вы уверены? Блокируется пользователь ${ctx.update.callback_query.message!.text.split('\n')[0].slice(13)}`, {reply_markup: {inline_keyboard: [[{text: 'Да', callback_data: 'banConfirm'}, {text: 'Назад', callback_data: 'banCancel'}]]}});
});

export const banConfAction = Composer.action('banConfirm', async (ctx) => {
    const bannedUser = ctx.update.callback_query.message!.text.split(' ');
    console.log(bannedUser[6]);
    new BotUser(bannedUser[6], 'x', 0).setBanned(1);
    logger.info(`${ctx.update.callback_query.from.id} || ${ctx.update.callback_query.from.username} banned a user`);
    await bot.telegram.sendMessage(bannedUser[6], `Сожалеем, но Вы были заблокированы!`);
    await ctx.editMessageText(`Пользователь забанен.`);
});

export const banCancAction = Composer.action('banCancel', async (ctx) => {
    logger.info(`${ctx.update.callback_query.from.id} || ${ctx.update.callback_query.from.username} refused to ban`);
    await ctx.deleteMessage(ctx.update.callback_query.message!.message_id);
})