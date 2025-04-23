import { bot, logger } from "../index.ts";
import { Composer, Context, Scenes } from "telegraf";
import { MyContext } from "../context/context.ts";
import { media_group, MediaGroup, MediaGroupContext } from "@dietime/telegraf-media-group";
import { TAKES_CHAT } from "../config/config.ts";

const test = new Composer<MyContext>();

test.use(new MediaGroup({ timeout: 1000 }).middleware());

interface MediaArrayI {
    type: string;
    media: string;
    caption?: string;
    parse_mode?: string;
}

test.on(media_group(), async (ctx: MediaGroupContext<MyContext>) => {
    let mediaArray: MediaArrayI = [];
    let author = `${ctx.from!.username ? `${ctx.from!.username} || ${ctx.from!.id}` : `не указан || ${ctx.from!.id}`}`.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1");

    for (const media of ctx.update.media_group) {
        const newCaption = media.caption!.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1");
        if ('photo' in media) {
            if('caption' in media) mediaArray.push({type: 'photo', media: media.photo[0].file_id, caption: `\`${newCaption}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\``, parse_mode: 'MarkdownV2'})
            else mediaArray.push({type: 'photo', media: media.photo[0].file_id});
        }
        if ('video' in media) {
            if('caption' in media) mediaArray.push({type: 'video', media: media.video[0].file_id, caption: `\`${newCaption}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\``, parse_mode: 'MarkdownV2'})
            else mediaArray.push({type: 'video', media: media.video[0].file_id});
        }
    }

    await bot.telegram.sendMediaGroup(TAKES_CHAT, mediaArray);
    await bot.telegram.sendMessage(TAKES_CHAT, `Автор медиагруппы: ${author}`, {parse_mode: 'MarkdownV2'});
    // TODO: дописать сраную кнопку тупого говна
    await ctx.reply(`Готово!`, {reply_markup: {inline_keyboard: [[{text: 'В главное меню', callback_data: 'main'}, {text: 'Еще раз?', callback_data: 'take'}]]}}); 

    logger.info(`${ctx.from?.id} || ${ctx.from?.username} left take scene`);

    return ctx.scene.leave();
});

test.on('message', async (ctx: MyContext) => {
    if('media_group_id' in ctx.message!) return;

    let author = `${ctx.from!.username ? `${ctx.from!.username} || ${ctx.from!.id}` : `не указан || ${ctx.from!.id}`}`.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1");

    if('text' in ctx.message!) await bot.telegram.sendMessage(TAKES_CHAT, `Автор тейка: ${author} \n\n\`${ctx.message.text.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\``, {reply_markup: {inline_keyboard: [[{text: `Принять ✅`, callback_data: 'acceptTake'}, {text: 'Забанить ⛔️', callback_data: 'banUser'}]]}, parse_mode: 'MarkdownV2'});
    if('caption' in ctx.message!) {
        if('photo' in ctx.message!) await bot.telegram.sendPhoto(TAKES_CHAT, ctx.message.photo[0].file_id, {caption: `Автор фотографии: ${author} \n\n\`${ctx.message.caption?.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\``, parse_mode: 'MarkdownV2', reply_markup: {inline_keyboard: [[{text: `Принять ✅`, callback_data: 'acceptTake'}, {text: 'Забанить ⛔️', callback_data: 'banUser'}]]}});
        if('video' in ctx.message!) await bot.telegram.sendVideo(TAKES_CHAT, ctx.message.video[0].file_id, {caption: `Автор видео: ${author} \n\n\`${ctx.message.caption?.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\``, parse_mode: 'MarkdownV2', reply_markup: {inline_keyboard: [[{text: `Принять ✅`, callback_data: 'acceptTake'}, {text: 'Забанить ⛔️', callback_data: 'banUser'}]]}});
    }
    else {
        if('photo' in ctx.message!) await bot.telegram.sendPhoto(TAKES_CHAT, ctx.message.photo[0].file_id, {caption: `Автор фотографии: ${author} \n\n\`#тейк | @xpdforum_takes_bot | @xpdforum\``, parse_mode: 'MarkdownV2'});
        if('video' in ctx.message!) await bot.telegram.sendVideo(TAKES_CHAT, ctx.message.video[0].file_id, {caption: `Автор видео: ${author} \n\n\`#тейк | @xpdforum_takes_bot | @xpdforum\``, parse_mode: 'MarkdownV2'});
    }

    await ctx.reply(`Готово!`, {reply_markup: {inline_keyboard: [[{text: 'В главное меню', callback_data: 'main'}, {text: 'Еще раз?', callback_data: 'take'}]]}, reply_parameters: {message_id: ctx.message!.message_id} });

    logger.info(`${ctx.from?.id} || ${ctx.from?.username} left take scene`);

    return ctx.scene.leave();
})

export const takeWizard = new Scenes.WizardScene<MyContext>('take',
    async (ctx) => {
        logger.debug(`${ctx.from!.id} || ${ctx.from!.username}: sending take`);

        await ctx.sendMessage(`Напишите Ваш тейк.`);

        return ctx.wizard.next();
    },
    test
);