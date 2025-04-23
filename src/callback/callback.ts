import { Composer, Scenes, session } from "telegraf";
import { bot } from "../index.ts";
import { BotUser, getUserByTId } from "../database/userDatabase.ts";
import { logger } from "../index.ts";
import { CHANNEL } from "../config/config.ts";
import { MyContext } from "../context/context.ts";
import { takeWizard } from "../wizard/takeWizard.ts";
import { adsWizard } from "../wizard/adsWizard.ts";
import { banMW } from "../middlewares/middleware.ts";

export const callbackComposer = new Composer<MyContext>();

const stage = new Scenes.Stage<MyContext>([takeWizard, adsWizard]);

callbackComposer.use(session());
callbackComposer.use(stage.middleware());

callbackComposer.action('take', async (ctx: MyContext) => {
    logger.info(`${ctx.from.id} || ${ctx.from.username} entered take scene`);
    ctx.scene.enter('take');
});

callbackComposer.action('ads', async (ctx) => {
    logger.info(`${ctx.from.id} || ${ctx.from.username} entered ads scene`);
    ctx.scene.enter('ads');
});

callbackComposer.action('main', banMW, async (ctx) => {
    await ctx.editMessageText('Главное меню', {reply_markup: {inline_keyboard: [[{text: 'Отправить тейк', callback_data: 'take'}, {text: 'Отправить запрос на ВП', callback_data: 'ads'}], [{text: 'Инфо', callback_data: 'info'}]]}});
});

callbackComposer.action('info', banMW, async (ctx) => {
    await ctx.editMessageText('XPD Forum Bot\n\nИз самых больших в мире альтруистических побуждений разработано верным IT-слугой — @creepy0964', {reply_markup: {inline_keyboard: [[{text: 'Назад', callback_data: 'main'}]]}});
});

callbackComposer.action('acceptTake', banMW, async (ctx) => {
    if('text' in ctx.update.callback_query.message!) await bot.telegram.sendMessage(CHANNEL, ctx.update.callback_query.message!.text.split('\n').slice(2).join('\n'));
    if('photo' in ctx.update.callback_query.message!) await bot.telegram.sendPhoto(CHANNEL, ctx.update.callback_query.message!.photo[0].file_id, {caption: ctx.update.callback_query.message!.caption!.split('\n').slice(2).join('\n')});
    if('video' in ctx.update.callback_query.message!) await bot.telegram.sendVideo(CHANNEL, ctx.update.callback_query.message!.video[0].file_id, {caption: ctx.update.callback_query.message!.caption!.split('\n').slice(2).join('\n')});

    logger.info(`${ctx.update.callback_query.from.id} || ${ctx.update.callback_query.from.username} accepted take`);

    await ctx.deleteMessage(ctx.update.callback_query.message!.message_id);
    await ctx.reply('Отправлено!');
});

callbackComposer.action('banUser', banMW, async (ctx) => {
    logger.info(`${ctx.update.callback_query.from.id} || ${ctx.update.callback_query.from.username} tried to ban a user`);
    await ctx.sendMessage(`Вы уверены? Блокируется пользователь ${ctx.update.callback_query.message!.text.split('\n')[0].slice(13)}`, {reply_markup: {inline_keyboard: [[{text: 'Да', callback_data: 'banConfirm'}, {text: 'Назад', callback_data: 'banCancel'}]]}});
});

callbackComposer.action('banConfirm', banMW, async (ctx) => {
    const bannedUser = ctx.update.callback_query.message!.text.split(' ');
    new BotUser(bannedUser[6], 'x', 0).setBanned(1);
    logger.info(`${ctx.update.callback_query.from.id} || ${ctx.update.callback_query.from.username} banned a user`);
    await bot.telegram.sendMessage(bannedUser[6], `Сожалеем, но Вы были заблокированы!`);
    await ctx.editMessageText(`Пользователь забанен.`);
});

callbackComposer.action('banCancel', banMW, async (ctx) => {
    logger.info(`${ctx.update.callback_query.from.id} || ${ctx.update.callback_query.from.username} refused to ban`);
    await ctx.deleteMessage(ctx.update.callback_query.message!.message_id);
});