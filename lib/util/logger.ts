import {Config} from "../config/config";
import chalk from "chalk";

const Console = require("console").Console;
const fs = require("fs");
const path = require("path");

const {log} = Config.getConfig();
const logPath = path.resolve(process.cwd(), log.dir, log.name);

if (!fs.existsSync(log.dir)) fs.mkdirSync(log.dir);
const stdout = fs.createWriteStream(logPath, { flags: "a" });
const logger = new Console({stdout, stderr: stdout });

export enum LoggerLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
}

function getLogContent(level: LoggerLevel, msg: string | Error) {
    const d = new Date();
    const time = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    return `${time} [${level}] ${msg}`;
}

const LoggerLevelColor = {
    DEBUG: chalk.white,
    INFO: chalk.white,
    WARN: chalk.yellow,
    ERROR: chalk.red,
};

function consoleLog(msg: string | Error, type: LoggerLevel) {
    const str = getLogContent(type, msg);
    const lower = type.toLowerCase();
    const keys = Object.keys(LoggerLevel);
    console[lower](LoggerLevelColor[type](str));
    if (keys.indexOf(type) >= keys.indexOf(log.level)) {
        logger[lower](str);
    }
}

/**
 * 解析 mb、kb单位
 * @param size
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
 * 超出文件大小 重命名文件
 */
function renameLogfile() {
    const size = parseSize(log.size);
    if (fs.existsSync(logPath) && fs.statSync(logPath).size <= size) return;
    const parser = path.parse(logPath);
    const getPath = (index) => path.resolve(parser.dir, `${parser.name}(${index})${parser.ext}`);
    let index = 1;
    while (true) {
        if (fs.existsSync(getPath(index))) {
            index++;
        } else {
            if (fs.existsSync(logPath)) {
                fs.renameSync(logPath, getPath(index));
            }
            break;
        }
    }
}

const Logger = {};
Object.keys(LoggerLevel).forEach(key => Logger[key.toLowerCase()] = (str) => consoleLog(str, key as LoggerLevel));

/**
 * 日志记录
 */
export default Logger as {
    warn: (str: string) => void;
    info: (str: string) => void;
    debug: (str: string) => void;
    error: (str: string | Error) => void;
};
