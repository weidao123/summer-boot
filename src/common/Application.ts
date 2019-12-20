import {InitConfigParams, RequestType} from "../types";
import {ControllerContainer} from "../utils";

const express= require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

/**
 * 应用程序基类
 */
export abstract class Application {

    protected constructor(rootPath?: string) {

        const app = express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));

        app.listen(this.config().port, () => console.log(this.config().message));

        app.all("*",  (req: any, res: any) => {

            let url: string = req.url;
            let method: RequestType = req.method;
            let body: any = req.body;
            let query: any = req.query || {};
            let allParams: any = Object.assign({}, body, query);

            url = url.split("?")[0];
            let parent: string = url.split("/")[1];
            let path: string = url.split("/")[2];
            this.routerMapping(parent, path, method, req, res, allParams)
                .catch(() => res.sendStatus(404));
        });

        // 开始加载controller、service repository
        rootPath = rootPath || path.join(__dirname, "../");
        this.load(rootPath, "service");
        this.load(rootPath, "controller");
    }

    /**
     * 在容器中匹配对应的方法
     * @param parent 父级路径
     * @param path   方法的路径
     * @param method 请求类型
     * @param req    request对象
     * @param res    response对象
     * @param params 请求的params
     */
    protected async routerMapping(parent: string, path: string, method: RequestType, req: any, res: any, params: any) {
        parent = "/" + parent;
        const target: any = await ControllerContainer.getMethod(parent, path, params, req, res);
        if(target) {
            res.send(target);
            return true;
        }
        return Promise.reject(false);
    }

    public abstract config(): InitConfigParams;

    /**
     * 自动加载文件
     * @param rootPath
     * @param directory
     */
    public load(rootPath: string, directory: string = "/controller") {
        const res: string[] = fs.readdirSync(rootPath + directory);
        if(res.length > 0) {
            res.forEach((item: string) => {
                let fPath = path.join(rootPath + directory, item);
                if(fs.statSync(fPath).isDirectory()) {
                    this.load(rootPath + directory, "/" + item);
                } else {
                    require(rootPath + directory + "/" + item.replace(".ts", ""));
                }
            });
        }
    }
}
