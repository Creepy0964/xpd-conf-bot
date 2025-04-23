import { Telegraf } from "telegraf";
import { TOKEN } from "./config/config.ts";
import { Logger } from "./utils/logger.ts";
import { MyContext } from "./context/context.ts";
import { initialize } from "./handlers/init.ts";

export const bot = new Telegraf<MyContext>(TOKEN);
export const logger = new Logger(3);

bot.catch(async err => {
    logger.error(err);
});

bot.launch(() => { initialize() });

process.once('SIGINT', () => { logger.info('Bot stopped'); bot.stop() });
process.once('SIGTERM', () => { logger.info('Bot stopped'); bot.stop() });