import { Context, session, Telegraf } from "telegraf";
import Database from "better-sqlite3";
import { start } from "./commands/start.ts";
import { Logger } from "./utils/logger.ts";
import { media_group, MediaGroup, type MediaGroupContext } from "@dietime/telegraf-media-group";
import { mainAction, infoAction, acceptTakeAction, banUserAction, banConfAction, banCancAction } from "./callback/callbackActions.ts";
import { takeAction } from "./callback/takeAction.ts";
import { adsAction } from "./callback/adsAction.ts"
import { MyContext } from "./model/interface.ts";

export const db = new Database('./db/database.db');
export const bot = new Telegraf<MyContext>('');
export const logger = new Logger(3);

bot.use(session());

bot.use(start);
bot.use(mainAction, infoAction, acceptTakeAction, banUserAction, banConfAction, banCancAction);
bot.use(adsAction);
bot.use(takeAction);
bot.use(new MediaGroup({ timeout: 1000 }).middleware())

db.prepare(`CREATE TABLE IF NOT EXISTS "profiles" (
	"tid"	INTEGER NOT NULL UNIQUE,
	"username"	INTEGER,
	"isBanned"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("tid" AUTOINCREMENT)
);`).run();

bot.on('message', async (ctx) => {
    if('reply_to_message' in ctx.update.message && ctx.update.message.reply_to_message?.chat.id == -1002249581112 && ctx.update.message.reply_to_message?.from?.id == 7125754105) {
        if('text' in ctx.update.message.reply_to_message) {
            let x: number = 0;
            let user = ctx.update.message.reply_to_message.text.split(' ');
            console.log(user);
            if(user.includes('ВП:')) x = 6;
            else if(user.includes('указан')) x = 5;
            else x = 4; 
            await bot.telegram.sendMessage(user[x], `Вам ответил администратор!\n\nОтвет: ${ctx.update.message.text}`);
            await ctx.reply('Ответ отправлен!');
        }
        if('caption' in ctx.update.message.reply_to_message) {
            let x: number = 0;
            let user = ctx.update.message.reply_to_message.caption?.split(' ');
            if(user?.includes('ВП:')) x = 4;
            else x = 4; 
            await bot.telegram.sendMessage(user[x], `Вам ответил администратор!\n\nОтвет: ${ctx.update.message.text}`);
            await ctx.reply('Ответ отправлен!');
        }
        logger.info(`${ctx.from.id} || ${ctx.from.username} replied to take`);
    }
    else {
        if(ctx.message.chat.type == 'private') await ctx.reply(`Извините, но я Вас не понял. Возможно, Вам следует использовать команду /start и попробовать использовать основное меню?`);
    }
});

bot.catch(async err => {
    console.log(err);
})

bot.launch(() => { logger.info('Bot started') });

process.once('SIGINT', () => { logger.info('Bot stopped'); bot.stop() });
process.once('SIGTERM', () => { logger.info('Bot stopped'); bot.stop() });
