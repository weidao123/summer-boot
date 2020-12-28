import {Request, Response, NextFunction, Application} from "express";

const path = require("path");
const fs = require("fs");

export interface ExceptionHandler {
    exception(req: Request, res: Response, e: Error);
}

export interface InterceptorHandler {
    before(req: Request, res: Response): boolean;
    after(req: Request, res: Response, data: any): Object;
}

export interface StarterHandler {
    before(app: Application): void;
    after(app: Application): void;
}

export class Config {

    private static conf;

    public static getConfig(): any {
        if (!this.conf) {
            this.conf = require("./config.default.json");
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
}
