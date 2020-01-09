import {RequestType} from "../types";
import {ControllerContainer} from "../utils";
import { ApplicationContainer } from "./config/ApplicationContainer";
import { ApplicationConfig } from "./config/ApplicationConfig";
import {LoadFileUtils} from "./utils/LoadFileUtils";
import {interceptorContainer} from "./Interceptor/InterceptorContainer";
import {Interceptor} from "./Interceptor/Interceptor";

const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

/**
 * 应用程序基类
 */
export abstract class Application {

    protected constructor(rootPath?: string) {
        this.rootPath = rootPath;
        // 加载默认配置
        this.addApplicationConfig(ApplicationConfig);
    }

    protected rootPath: string;
    public start(): any {

        const applicationContainer = ApplicationContainer;

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));

        app.listen(applicationContainer.port, () => {
            const str: string = `【running success】: your app is running here http://localhost:${ApplicationContainer.port}`;
            console.log(str);
        });

        app.all("*",  async (req: any, res: any) => {

            let url: string[] = req.url.substring(1).split("/");
            let method: RequestType = req.method;
            let body: any = req.body;
            let query: any = req.query || {};
            let allParams: any = Object.assign({}, body, query);

            req._parentURL = url[0];
            if (!await interceptorContainer.checkInterceptor(allParams, req, res)) {
                res.sendStatus(401);
                return false;
            }
            this.routerMapping(url, method, req, res, allParams)
                .catch(() => res.sendStatus(404));
        });

        let rootPath = this.rootPath;
        // 开始加载controller、service repository
        rootPath = rootPath || path.join(__dirname, "../");
        LoadFileUtils.load(`${rootPath}service`);
        LoadFileUtils.load(`${rootPath}controller`);
    }

    /**
     * 添加配置信息
     * @param Target 继承自 ApplicationConfig 类的子类
     */
    public addApplicationConfig(Target: object): Application {
        ApplicationContainer.setConfig(Target || ApplicationConfig);
        return this;
    }

    /**
     * 添加拦截器
     * @param interceptor 继承自 Interceptor 类的子类
     */
    public addInterceptor(interceptor: Interceptor): Application {
        interceptorContainer.addInterceptor(interceptor);
        return this;
    }

    /**
     * 在容器中匹配对应的方法
     * @param url 路径
     * @param method 请求类型
     * @param req    request对象
     * @param res    response对象
     * @param params 请求的params
     */
    protected async routerMapping(url: string[], method: RequestType, req: any, res: any, params: any) {
        let parent: string = url[0];
        let path: string = url[1];
        const target: any = await ControllerContainer.getMethod(parent, path, params, req, res);
        if(target) {
            res.send(target);
            return true;
        }
        return Promise.reject(false);
    }

}
