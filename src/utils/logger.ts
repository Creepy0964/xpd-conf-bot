export class Logger {
    logType: number;

    constructor(logType: number) {
        this.logType = logType
    }

    info(text: string) {
        if(this.logType >= 1) console.log(`[${new Date()}] INFO: ${text}`);
    }

    warn(text: string) {
        if(this.logType >= 3) console.log(`[${new Date()}] WARN: ${text}`);
    }

    error(text: string) {
        if(this.logType >= 2) console.error(`[${new Date()}] ERROR: ${text}`);
    }

    debug(text: string) {
        if(this.logType >= 4) console.log(`[${new Date()}] DEBUG: ${text}`);
    }
}