import {Config} from "../config/config";

const Console = require("console").Console;
const fs = require("fs");
const path = require("path");

const {log} = Config.getConfig();
const logPath = path.resolve(process.cwd(), log.dir, log.name);

if (!fs.existsSync(log.dir)) {
    fs.mkdirSync(log.dir);
}

const options = {
    flags: 'a',     // append模式
    encoding: 'utf8',
};

const stdout = fs.createWriteStream(logPath, options);
const logger = new Console({stdout, stderr: stdout });

type LoggerLevel = "INFO" | "DEBUG" | "ERROR" | "WARNING";

function getLogContent(level: LoggerLevel, msg: string | Error) {
    const d = new Date();
    const time = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    return `[${time}] [${level}] ${msg}`;
}

/**
 * 日志记录
 */
export default class Logger {

    public static warning(str: string) {
        const msg = getLogContent("WARNING", str);
        logger.warn('\x1B[33m%s\x1B[0m', msg);
        console.warn('\x1B[33m%s\x1B[0m', msg);
    }

    public static info(str: string) {
        const msg = getLogContent("INFO", str);
        logger.warn(msg);
        console.warn(msg);
    }

    public static debug(str: string) {
        const msg = getLogContent("DEBUG", str);
        logger.debug(msg);
        console.debug(msg);
    }

    public static error(str: string | Error) {
        const msg = getLogContent("ERROR", str);
        logger.error("\x1B[31m%s\x1B[0m", msg);
        console.error("\x1B[31m%s\x1B[0m", msg);
    }
}
