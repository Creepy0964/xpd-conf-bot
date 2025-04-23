import { appendFileSync } from "fs";

export class Logger {
    logType: number;

    constructor(logType: number) {
        this.logType = logType
    }

    info(text: string) {
        if(this.logType >= 1) {
            const date = new Date();
            console.log(`[${date}] INFO: ${text}`);
            appendFileSync(`./logs/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.log`, `[${date}] INFO: ${text}\n`);
        }
    }

    warn(text: string) {
        if(this.logType >= 1) {
            const date = new Date();
            console.log(`[${date}] WARN: ${text}`);
            appendFileSync(`./logs/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.log`, `[${date}] WARN: ${text}\n`);
        }
    }

    error(text: string) {
        if(this.logType >= 1) {
            const date = new Date();
            console.log(`[${date}] ERROR: ${text}`);
            appendFileSync(`./logs/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.log`, `[${date}] ERROR: ${text}\n`);
        }
    }

    debug(text: string) {
        if(this.logType >= 1) {
            const date = new Date();
            console.log(`[${date}] DEBUG: ${text}`);
            appendFileSync(`./logs/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.log`, `[${date}] DEBUG: ${text}\n`);
        }
    }
}