import { bot, logger } from "../index.ts";
import { msgComposer } from "./messageHandler.ts";
import { callbackComposer } from "../callback/callback.ts";
import { logClearTimeout } from "../utils/logClear.ts";

export async function initialize() {
    bot.use(callbackComposer);
    logger.info('initalized callbackComposer');

    bot.use(msgComposer);
    logger.info('initialized messageHandler');

    logClearTimeout();
    logger.info('initialized logClearTimeout')

    logger.info('Bot started');
}