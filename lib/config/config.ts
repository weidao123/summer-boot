import {Request, Response, NextFunction, Application} from "express";
import {deepMerge} from "../util/deep-merge";
import Loader from "../util/loader";

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
        const p = Loader.getPathAsExtname(path.resolve(process.cwd(), this.conf.configDir));
        const conf = Loader.loadFile(p);
        if (conf) {
            deepMerge(this.conf, conf);
        }
    }
}
