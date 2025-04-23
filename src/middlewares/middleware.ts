import { MiddlewareFn } from "telegraf";
import { Context } from "telegraf";
import { getUserByTId } from "../database/userDatabase.ts";

export const banMW: MiddlewareFn<Context> = async (ctx, next) => {
    if(getUserByTId(ctx.from!.id) != undefined && getUserByTId(ctx.from!.id)!.isBanned == 0) next();
};