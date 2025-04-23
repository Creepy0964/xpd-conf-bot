import { readdirSync, statSync, unlinkSync } from "fs"
import { logger } from "..";

export const logClearTimeout = () => {
    setInterval(() => {
        const files = readdirSync('./logs');
    
        for(const x of files) {
            const birthTime = statSync(`./logs/${x}`).birthtimeMs
            if(Date.now() - birthTime > 2629743000) {
                unlinkSync(`./logs/${x}`);
                logger.debug(`log ${x} is expired and deleted`);
            }
        }
    }, 86400000)
}