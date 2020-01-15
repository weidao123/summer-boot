import {RequestType} from "./types";
import {ControllerContainer} from "./utils";
import { ApplicationContainer } from "./config/ApplicationContainer";
import { ApplicationConfig } from "./config/ApplicationConfig";
import {LoadFileUtils} from "./utils/LoadFileUtils";
import {interceptorContainer} from "./Interceptor/InterceptorContainer";
import {Interceptor} from "./Interceptor/Interceptor";

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

/**
 * 应用程序基类
 */
export abstract class Application {

    protected constructor(dirname: string) {
        this.rootPath = dirname;
        // 加载默认配置
        this.addApplicationConfig(ApplicationConfig);
    }

    public abstract addConfig(application: Application): Application;
    public rootPath: string;
    public start(): any {

        const applicationContainer = ApplicationContainer;
        const port: number = ApplicationContainer.applicationConfig.port;

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));

        app.listen(port, () => {
            const str: string = `【SUCCESS】: Your app is running here http://localhost:${port}`;
            console.log(str);
        });

        app.all("*",  async (req: any, res: any) => {

            let method: RequestType = req.method;
            let body: any = req.body;
            let query: any = req.query || {};
            let allParams: any = Object.assign({}, body, query);
            this.routerMapping(method, req, res, allParams).catch(() => res.sendStatus(404));
        });

        let rootPath = this.rootPath;
        let serviceName = applicationContainer.applicationConfig.service;
        let controllerName = applicationContainer.applicationConfig.controller;
        // 开始加载controller、service repository
        rootPath = rootPath || path.join(__dirname, "../");
        LoadFileUtils.load(`${rootPath}\\${serviceName}`);
        LoadFileUtils.load(`${rootPath}\\${controllerName}`);
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
     * @param method 请求类型
     * @param req    request对象
     * @param res    response对象
     * @param params 请求的params
     */
    protected async routerMapping(method: RequestType, req: any, res: any, params: any) {
        const target: any = await ControllerContainer.getMethod(params, req, res);
        if(!target) {
            return Promise.reject(false);
        }
    }

}
