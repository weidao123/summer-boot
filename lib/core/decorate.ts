import "reflect-metadata";

const Path2Regexp = require("path-to-regexp");

export enum MetaKey {
    CONTROLLER = "CONTROLLER",
    METHOD = "METHOD",
    METHOD_PARAM = "METHOD_PARAM",
    REQUEST = "REQUEST",
    RESPONSE = "RESPONSE",
    QUERY = "QUERY",
    BODY = "BODY",
    SERVICE = "SERVICE",
    INJECT = "INJECT",
    COMPONENT = "COMPONENT",
    INTERCEPTOR = "INTERCEPTOR",
}

export enum RequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    OPTION = "OPTION",
}

export interface ControllerOptions {
    path?: string;
}

export interface MethodOptions {
    path: string;
    method?: RequestMethod;
}

export type Constructor = { new (...args) }

/**
 * 控制器
 */
export function Controller(options: ControllerOptions = {}) {
    options.path = options.path || "/";
    return function (target: Function) {
        Reflect.defineMetadata(MetaKey.CONTROLLER, options, target);
    }
}

/**
 * 方法装饰器
 * @constructor
 */
export function RequestMapping(options: MethodOptions) {
    options.method = options.method || RequestMethod.GET;
    return function (target: Object, name: string, desc: any) {
        Reflect.defineMetadata(MetaKey.METHOD, options, target[name]);
    }
}

/**
 * 参数装饰器
 * @constructor
 */
export function PathVariable(key: string) {
    return function (target: Object, name: string, index: number) {
        const metadata = Reflect.getMetadata(MetaKey.METHOD_PARAM, target[name]);
        let arr = [{ index, key }];
        if (metadata && Array.isArray(metadata)) {
            arr = arr.concat(metadata)
        }
        Reflect.defineMetadata(MetaKey.METHOD_PARAM, arr, target[name])
    }
}

/**
 * 注入request
 * @constructor
 */
export function Req(target: Object, name: string, index: number) {
    Reflect.defineMetadata(MetaKey.REQUEST, { index }, target[name]);
}

/**
 * 注入response
 * @constructor
 */
export function Res(target: Object, name: string, index: number) {
    Reflect.defineMetadata(MetaKey.RESPONSE, { index }, target[name]);
}

/**
 * 注入query参数
 * @constructor
 */
export function Query(target: Object, name: string, index: number) {
    Reflect.defineMetadata(MetaKey.QUERY, { index }, target[name]);
}

/**
 * 注入body参数
 * @constructor
 */
export function Body(target: Object, name: string, index: number) {
    Reflect.defineMetadata(MetaKey.BODY, { index }, target[name]);
}

/**
 * 装饰 Service
 * @constructor
 */
export function Service() {
    return function (target: Constructor) {
        Reflect.defineMetadata(MetaKey.SERVICE, {}, target);
    }
}

/**
 * 装饰 Component
 * @constructor
 */
export function Component() {
    return function (target: Constructor) {
        Reflect.defineMetadata(MetaKey.COMPONENT, {}, target);
    }
}

/**
 * 注入服务
 * @constructor
 */
export function Autowrite() {
    return function (target: Object, name: string) {
        target[name] = null;
        Reflect.defineMetadata(MetaKey.INJECT, { target, name }, target, name);
    }
}

/**
 * 拦截器
 * @param path 拦截器的拦截地址 不传 拦截全部
 */
export function Interceptor(path?: string) {
    return function (target: Constructor) {
        Reflect.defineMetadata(MetaKey.INTERCEPTOR, { rules: path ? Path2Regexp.pathToRegexp(path) : null }, target);
    }
}
