import {Config} from "../config/config";
import SummerDate from "./date";

const Console = require("console").Console;
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");

const {log} = Config.getConfig();
const logPath = path.resolve(process.cwd(), log.dir, log.name);

if (!fs.existsSync(log.dir)) fs.mkdirSync(log.dir);
const stdout = fs.createWriteStream(logPath, { flags: "a" });
const logger = new Console({stdout, stderr: stdout });

/**
 * 日志级别
 */
enum LoggerLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
}

/**
 * 日志输出到控制台的颜色
 */
const LoggerLevelColor = {
    DEBUG: chalk.white,
    INFO: chalk.white,
    WARN: chalk.yellow,
    ERROR: chalk.red,
};

/**
 * 日志输出
 * @param msg
 * @param type
 */
function consoleLog(msg: string | Error, type: LoggerLevel) {
    const time = SummerDate.currentDate();
    const str = `${time} [${type}] ${msg}`;
    const lower = type.toLowerCase();
    const keys = Object.keys(LoggerLevel);
    console[lower](LoggerLevelColor[type](str));
    if (keys.indexOf(type) >= keys.indexOf(log.level)) {
        logger[lower](str);
    }
    renameLogfile();
}

/**
 * 超出文件大小 重命名文件（多进程模式下、这里可能会被多个进程同时执行）
 */
function renameLogfile() {
    const size = parseSize(log.size);
    if (fs.existsSync(logPath) && fs.statSync(logPath).size <= size) return;
    const parser = path.parse(logPath);
    const ymd = SummerDate.format("YYYY-MM-DD");
    const getPath = (index) => path.resolve(parser.dir, `${parser.name}-${ymd}(${index})${parser.ext}`);
    let index = 1;
    while (true) {
        const p = getPath(index);
        if (!fs.existsSync(p)) {
            const write = fs.createWriteStream(p);
            write.on("open", () => {
                const read = fs.createReadStream(logPath);
                read.pipe(write);
                read.on("end", () => fs.writeFileSync(logPath, ""))
            });
            break;
        } else {
            index++;
        }
    }
}

/**
 * 解析 mb、kb单位
 * @param size (kb、mb)
 * @return b
 */
function parseSize(size: string | number) {
    if (typeof size === "string") {
        const num = Number(size.replace(/[a-zA-Z]/g, ""));
        if (size.endsWith("mb")) {
            return num * 1024 * 1024;
        }
        if (size.endsWith("kb")) {
            return num * 1024;
        }
        throw new Error("log size format error");
    } else {
        return size * 1024;
    }
}

/**
 * 暴露日志输出方法
 */
const Logger = {};
Object.keys(LoggerLevel).forEach(key => Logger[key.toLowerCase()] = (str) => consoleLog(str, key as LoggerLevel));

export default Logger as {
    warn: (str: string) => void;
    info: (str: string) => void;
    debug: (str: string) => void;
    error: (str: string | Error) => void;
};
