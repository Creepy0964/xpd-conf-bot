import { UserI } from "./interface.ts";
import { db, logger } from "../index.ts";
import { User } from "@telegraf/types";

export function getUserByTId(tId: number): BotUser | undefined {
    const user: any = db.prepare(`SELECT * FROM profiles WHERE tId = ?`).get(tId);
    logger.debug(`executed SELECT by telegram id. got ${user === undefined ? undefined : user.username}`);
    return user === undefined ? undefined : new BotUser(user.tId, user.username, user.isBanned);
}

export function addUser(tUser: User): BotUser | Error {
    if(typeof(tUser.username) === undefined) return Error("username is undefined");
    const user = db.prepare(`INSERT INTO profiles (tId, username, isBanned) VALUES (?, ?, ?)`).run(tUser.id, tUser.username, 0);
    logger.debug(`executed INSERT to profiles: ${tUser.id} || ${tUser.username}`);
    return new BotUser(tUser.id, tUser.username!, 0);
}

export class BotUser implements UserI {
    tId: number;
    username: string;
    isBanned: number;

    constructor(tId: number, username: string, isBanned: number) {
        this.tId = tId;
        this.username = username;
        this.isBanned = isBanned;
    }

    setBanned(status: number) {
        const user = db.prepare(`UPDATE profiles SET isBanned = ? WHERE tId = ?`).run(status.toString(), this.tId);
        this.isBanned = status;
        return user.changes;
    }
}