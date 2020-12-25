import {Request, Response, NextFunction, Application} from "express";

const path = require("path");
const fs = require("fs");

export interface ErrorHandler {
    errorHandler(req: Request, res: Response, next?: NextFunction);
    notFoundHandler(req: Request, res: Response, next?: NextFunction);
}

export interface StarterHandler {
    before?(app: Application): void;
}

export class Config {

    private static conf: Config;

    public static getConfig() {
        if (!this.conf) {
            this.conf = new Config();
            this.merge();
        }
        return this.conf;
    }

    public static merge() {
        // 加载默认的配置文件
        const confPath = path.resolve(process.cwd(), 'summer-boot.json');
        if (fs.existsSync(confPath)) {
            const conf = require(confPath) || {};
            Object.assign(Config.conf, conf);
        }
    }

    public port?: number = 8080;

    // 所有的目录都是相对于项目根目录
    public baseDir?: string = "app";
    public clientOutputDir?: string = "dist";
    public logDir?: string = "logs";

    // 文件 会优先加载 ts文件 后加载js文件
    public starterHandlerFile?: string = "app/config/starter-handler";

    public ssrTemplate?: string = "index.html";

}
