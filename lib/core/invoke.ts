import Container from "./container";

import {Request, Response, NextFunction} from "express";
import {MetaKey, RequestMethod} from "./decorate";

/**
 * 调用实际的接口方法
 */
export async function invoke(req: Request, res: Response, next: NextFunction) {
    const value = Container.get(req.path, req.method.toUpperCase() as RequestMethod);
    if (value) {
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

        try {
            const data = await value.func.call(value.instance, ...args);
            res.send(data);
        } catch (e) {
            res.status(500);
            res.send(e);
        }
        return;
    }

    res.status(404);
    res.send("404");
}
