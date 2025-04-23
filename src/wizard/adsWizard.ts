import { bot, logger } from "../index.ts";
import { Composer, Context, Scenes } from "telegraf";
import { MyContext } from "../context/context.ts";
import { ADS_CHAT } from "../config/config.ts";

const test = new Composer<MyContext>();

test.on('message', async (ctx: MyContext) => {
    let author = `${ctx.from!.username ? `${ctx.from!.username} || ${ctx.from!.id}` : `не указан || ${ctx.from!.id}`}`.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1");

    if('text' in ctx.message!) await bot.telegram.sendMessage(ADS_CHAT, `Автор запроса на ВП: ${author} \n\n\`${ctx.message.text.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\``, {parse_mode: 'MarkdownV2'});
    if('caption' in ctx.message!) {
        const newCaption = ctx.message.caption!.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1");
        if('photo' in ctx.message!) await bot.telegram.sendPhoto(ADS_CHAT, ctx.message.photo[0].file_id, {caption: `Автор запроса на ВП: ${author} \n\n${newCaption}`, parse_mode: 'MarkdownV2'});
        if('video' in ctx.message!) await bot.telegram.sendVideo(ADS_CHAT, ctx.message.video[0].file_id, {caption: `Автор запроса на ВП: ${author} \n\n${newCaption}`, parse_mode: 'MarkdownV2'});
    }

    await ctx.reply(`Готово!`, {reply_markup: {inline_keyboard: [[{text: 'В главное меню', callback_data: 'main'}, {text: 'Еще раз?', callback_data: 'ads'}]]}, reply_parameters: {message_id: ctx.message!.message_id} });

    logger.info(`${ctx.from!.id} || ${ctx.from!.username} left ads scene`);

    return ctx.scene.leave();
})

export const adsWizard = new Scenes.WizardScene<MyContext>('ads',
    async (ctx) => {
        logger.debug(`${ctx.from!.id} || ${ctx.from!.username}: sending ad`);

        await ctx.sendMessage(`Напишите Ваш запрос на ВП.`);

        return ctx.wizard.next();
    },
    test
);