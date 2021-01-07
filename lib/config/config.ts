import {Request, Response, Application} from "express";
import {deepMerge} from "../util/deep-merge";
import Loader from "../util/loader";
import ConfigDefault from "./config.default";

const path = require("path");

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

export type Conf = {
    [K in keyof typeof ConfigDefault]?: typeof ConfigDefault[K];
};

export class Config {

    private static conf: Conf;

    public static getConfig(): Conf {
        if (!this.conf) {
            this.conf = ConfigDefault;
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
