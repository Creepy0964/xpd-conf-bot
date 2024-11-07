import { Telegraf } from "telegraf";
import telegrafMediaGroup from "telegraf-media-group";
import axios from "axios";

const bot = new Telegraf(process.env.TOKEN);

const adm_chat = -1002249581112;
const statuses = ['member', 'administrator', 'creator', 'restricted'];

bot.use(telegrafMediaGroup());

bot.command('start', async (ctx) => {
    bot.telegram.getChatMember(-1002181363757, ctx.from.id).then(async (x) => {
        if(statuses.includes(x.status)) {
            const profile = await axios.get(`${process.env.IP}:7777/profile/${ctx.from.id}`);
            if(!profile.data) await axios.post(`${process.env.IP}:7777/profile/reg`, {
                tid: ctx.from.id,
                username: ctx.from.username
            });
            await ctx.reply('Добро пожаловать!', {reply_markup: {inline_keyboard: [[{text: 'Отправить тейк', callback_data: 'take'}, {text: 'Отправить запрос на ВП', callback_data: 'ads'}], [{text: 'Инфо', callback_data: 'info'}]]}, reply_to_message_id: ctx.message.message_id});
        }
        else {
            await ctx.reply('Упс! Для того, чтобы использовать бота, Вы должны быть подписаны на канал.\n\nПосле подписки нажмите /start снова.', {reply_markup: {inline_keyboard: [[{text: 'Подписаться', url: 'https://t.me/xpdforum'}]]}, reply_to_message_id: ctx.message.message_id});
            return;
        }
    });    
});

bot.on('message', async (ctx) => {
    const profile = await axios.get(`${process.env.IP}:7777/profile/${ctx.from.id}`);

    if(profile.data.state == 1) {
        let author = `${ctx.from.username ? ctx.from.username : ctx.from.id}`.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1");
        if(ctx.mediaGroup) {
            let media = [];
            for(const message of ctx.mediaGroup) {
                if(ctx.msg.photo) {
                    if(message.caption) media.push({type: 'photo', media: message.photo[0].file_id, caption: `\`${message.caption.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\``, parse_mode: 'MarkdownV2'});
                    else media.push({type: 'photo', media: message.photo[0].file_id});
                }
                if(ctx.msg.document) {
                    if(message.caption) media.push({type: 'document', media: message.document.file_id, caption: `\`${message.caption.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\``, parse_mode: 'MarkdownV2'});
                    else media.push({type: 'document', media: message.document[0].file_id});
                }
                if(ctx.msg.video) {
                    if(message.caption) media.push({type: 'video', media: message.video.file_id, caption: `\`${message.caption.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\``, parse_mode: 'MarkdownV2'});
                    else media.push({type: 'video', media: message.video[0].file_id});
                }
                if(ctx.msg.audio) {
                    if(message.caption) media.push({type: 'audio', media: message.audio.file_id, caption: `\`${message.caption.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\``, parse_mode: 'MarkdownV2'});
                    else media.push({type: 'audio', media: message.audio[0].file_id});
                }
            }
            await bot.telegram.sendMessage(adm_chat, `Автор медиагруппы: ${author}`);
            await bot.telegram.sendMediaGroup(adm_chat, media);
        }
        else {
            if(ctx.msg.photo && !ctx.mediaGroup) {
                await bot.telegram.sendMessage(adm_chat, `Автор фотографии: ${author}`);
                await bot.telegram.sendPhoto(adm_chat, ctx.msg.photo[0].file_id, {caption: ctx.msg.caption? `\`${ctx.msg.caption.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\`` : "\`#тейк | @xpdforum_takes_bot | @xpdforum\`", parse_mode: 'MarkdownV2'});
            }
            else if(ctx.msg.video && !ctx.mediaGroup) {
                await bot.telegram.sendMessage(adm_chat, `Автор видео: ${author}`);
                await bot.telegram.sendVideo(adm_chat, ctx.msg.video.file_id, {caption: ctx.msg.caption? `\`${ctx.msg.caption.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\`` : "\`#тейк | @xpdforum_takes_bot | @xpdforum\`", parse_mode: 'MarkdownV2'});
            }
            else if(ctx.msg.audio && !ctx.mediaGroup) {
                await bot.telegram.sendMessage(adm_chat, `Автор аудиофайла: ${author}`);
                await bot.telegram.sendAudio(adm_chat, ctx.msg.audio.file_id, {caption: ctx.msg.caption? `\`${ctx.msg.caption.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\`` : "\`#тейк | @xpdforum_takes_bot | @xpdforum\`", parse_mode: 'MarkdownV2'});
            }
            else if(ctx.msg.document && !ctx.mediaGroup) {
                await bot.telegram.sendMessage(adm_chat, `Автор документа: ${author}`);
                await bot.telegram.sendDocument(adm_chat, ctx.msg.document.file_id, {caption: ctx.msg.caption? `\`${ctx.msg.caption.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\`` : "\`#тейк | @xpdforum_takes_bot | @xpdforum\`", parse_mode: 'MarkdownV2'});
            }
            else if(ctx.msg.voice) {
                await bot.telegram.sendMessage(adm_chat, `Автор голосового сообщения: ${author}`);
                await bot.telegram.sendVoice(adm_chat, ctx.msg.voice.file_id, {caption: ctx.msg.caption? `\`${ctx.msg.caption.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\`` : "\`#тейк | @xpdforum_takes_bot | @xpdforum\`", parse_mode: 'MarkdownV2'});
            }
            else if(ctx.msg.video_note) {
                await bot.telegram.sendMessage(adm_chat, `Автор видеосообщения: ${author}`);
                await bot.telegram.sendVideoNote(adm_chat, ctx.msg.video_note.file_id, {caption: ctx.msg.caption? `\`${ctx.msg.caption.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\`` : "\`#тейк | @xpdforum_takes_bot | @xpdforum\`", parse_mode: 'MarkdownV2'});
            }
            else {
                await bot.telegram.sendMessage(adm_chat, `Автор тейка: ${author}\n\n\`${ctx.message.text.replace(/([_*[\]()~`>#\+\-=|{}.!])/g, "\\$1")}\n\n#тейк | @xpdforum_takes_bot | @xpdforum\``, {parse_mode: 'MarkdownV2'});
            }
        }
        const profile = await axios.patch(`${process.env.IP}:7777/profile/state`, {
            tid: ctx.from.id,
            state: 0
        });
        await ctx.reply(`Готово!`, {reply_markup: {inline_keyboard: [[{text: 'В главное меню', callback_data: 'main'}, {text: 'Еще раз?', callback_data: 'take'}]]}, reply_to_message_id: ctx.message.message_id}); 
    }
    if(profile.data.state == 2) {
        let author = `${ctx.from.username ? ctx.from.username : ctx.from.id}`
        await bot.telegram.sendMessage(adm_chat, `Запрос на ВП от: ${author}\n\n${ctx.message.text}`);
        const profile = await axios.patch(`${process.env.IP}:7777/profile/state`, {
            tid: ctx.from.id,
            state: 0
        });
        await ctx.reply(`Готово!`, {reply_markup: {inline_keyboard: [[{text: 'В главное меню', callback_data: 'main'}, {text: 'Еще одно?', callback_data: 'ads'}]]}, reply_to_message_id: ctx.message.message_id}); 
    }
});

bot.action('main', async (ctx) => {
    await ctx.editMessageText('Главное меню', {reply_markup: {inline_keyboard: [[{text: 'Отправить тейк', callback_data: 'take'}, {text: 'Отправить запрос на ВП', callback_data: 'ads'}], [{text: 'Инфо', callback_data: 'info'}]]}});
});

bot.action('info', async (ctx) => {
    await ctx.editMessageText('XPD Forum Bot\n\nИз самых больших в мире альтруистических побуждений разработано верным IT-слугой — @creepy0964', {reply_markup: {inline_keyboard: [[{text: 'Назад', callback_data: 'main'}]]}});
});

bot.action('take', async (ctx) => {
    const profile = await axios.patch(`${process.env.IP}:7777/profile/state`, {
        tid: ctx.from.id,
        state: 1
    });
    await ctx.editMessageText(`Напишите Ваш тейк.`);
});

bot.action('ads', async (ctx) => {
    const profile = await axios.patch(`${process.env.IP}:7777/profile/state`, {
        tid: ctx.from.id,
        state: 2
    });
    await ctx.editMessageText(`Напишите Ваш запрос на ВП. Примечание: бот принимает ТОЛЬКО текст.`);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))