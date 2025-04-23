import { Scenes, Composer, session } from "telegraf";
import { takeWizard } from "../wizard/takeWizard.ts";
import { MyContext } from "../context/context.ts";
import { getUserByTId } from "../database/userDatabase.ts";
import { logger } from "../index.ts";

const composer = new Composer<MyContext>();

export const stage = new Scenes.Stage<MyContext>([takeWizard]);

composer.use(stage.middleware());

export const takeAction = composer.action('take', async (ctx) => {
    if(getUserByTId(ctx.from!.id) != undefined && getUserByTId(ctx.from!.id)!.isBanned == 1) return;
    logger.info(`${ctx.from.id} || ${ctx.from.username} entered take scene`);
    ctx.scene.enter('take');
});