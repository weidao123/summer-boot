import Container from "./container";

import {Request, Response, NextFunction} from "express";
import {MetaKey, RequestMethod} from "./decorate";
import Logger from "../util/logger";
import {ExceptionHandler, InterceptorHandler} from "./config";

/**
 * 调用实际的接口方法
 */
export async function invoke(req: Request, res: Response, next: NextFunction) {

    try {
        const value = Container.get(req.path, req.method.toUpperCase() as RequestMethod);

        if (!value) {
            res.status(404);
            throw new Error("404 Not Found")
        }

        const interceptors = Container.getInterceptor(req.path);
        const args = [];

        // 注入query参数
        if (Reflect.hasMetadata(MetaKey.QUERY, value.func)) {
            const index = Reflect.getMetadata(MetaKey.QUERY, value.func).index;
            args[index] = req.query
        }

        // 注入body参数
        if (Reflect.hasMetadata(MetaKey.BODY, value.func)) {
            const index = Reflect.getMetadata(MetaKey.BODY, value.func).index;
            args[index] = req.body;
        }

        // 注入path参数
        if (value.params) {
            const params = {};
            const split = req.path.split("/").slice(1);
            const metadata = Reflect.getMetadata(MetaKey.METHOD_PARAM, value.func);
            Object.keys(value.params).forEach(key => params[key] = split[value.params[key]]);
            metadata && metadata.forEach(item => args[item.index] = params[item.key]);
        }

        // 注入Request | Response
        const resData = Reflect.getMetadata(MetaKey.RESPONSE, value.func);
        const reqData = Reflect.getMetadata(MetaKey.REQUEST, value.func);
        if (reqData) args[reqData.index] = req;
        if (resData) args[resData.index] = res;

        let response;
        Logger.info(`${req.ip} ${req.url}`);
        // 调用请求拦截器
        for (const interceptor of interceptors) {
            const isNext = await (interceptor.instance as InterceptorHandler).before(req, res);
            if (isNext === false) {
                return;
            }
        }
        response = await value.func.call(value.instance, ...args);

        // 调用响应拦截器
        for (const interceptor of interceptors) {
            response = await (interceptor.instance as InterceptorHandler).after(req, res, response);
        }
        res.send(response);
    } catch (e) {
        Logger.error(req.url);
        Logger.error(e);
        const errorHandler = Container.getErrorHandler();
        if (errorHandler.length !== 0) {
            errorHandler.forEach(item => {
                (item.instance as ExceptionHandler).exception(req, res, e);
            });
        } else {
            res.send(e);
        }
    }
}
