import { Scenes, session, Context } from "telegraf";
import { Composer } from "telegraf";
import { adsWizard } from "../wizard/adsWizard.ts";
import { MyContext } from "../model/interface.ts";
import { getUserByTId } from "../model/database.ts";
import { logger } from "../index.ts";

const composer = new Composer<MyContext>();

export const stage = new Scenes.Stage<MyContext>([adsWizard]);

composer.use(stage.middleware());

export const adsAction = composer.action('ads', async (ctx) => {
    if(getUserByTId(ctx.from!.id) != undefined && getUserByTId(ctx.from!.id)!.isBanned == 1) return;
    logger.info(`${ctx.from.id} || ${ctx.from.username} entered ads scene`);
    ctx.scene.enter('ads');
});