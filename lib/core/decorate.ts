import "reflect-metadata";
import {ScheduleRule} from "../runtime/agent/schedule";

const Path2Regexp = require("path-to-regexp");

export enum MetaKey {
    CONTROLLER = "CONTROLLER",
    METHOD = "METHOD",
    METHOD_PARAM = "METHOD_PARAM",
    REQUEST = "REQUEST",
    RESPONSE = "RESPONSE",
    QUERY = "QUERY",
    BODY = "BODY",
    INJECT = "INJECT",
    COMPONENT = "COMPONENT",
    INTERCEPTOR_HANDLER = "INTERCEPTOR_HANDLER",
    ERROR_HANDLER = "ERROR_HANDLER",
    SCHEDULE = "SCHEDULE",
    TYPE_CONVERT = "TYPE_CONVERT",
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

export enum ParamType {
    string,
    number,
    boolean,
    object,
    date,
    symbol,
    entity,
}

export interface ParamConvert {
    type: ParamType;
    checked?: boolean;
    entity?: Constructor;
}

export type Constructor = { new (...args) }

function defineComponent(target: Constructor) {
    Reflect.defineMetadata(MetaKey.COMPONENT, {}, target);
}

function defineRequest(func: Function, op: MethodOptions) {
    Reflect.defineMetadata(MetaKey.METHOD, op, func)
}

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
export function RequestMapping(o: MethodOptions | string) {
    const op: MethodOptions = {method: RequestMethod.GET, path: ""};
    if (typeof o === "string") {
        op.path = o;
    } else {
        op.path = o.path;
        op.method = o.method || RequestMethod.GET;
    }
    return function (target: Object, name: string, desc: any) {
        defineRequest(target[name], op);
    }
}

export function Get(path: string) {
    return function (target: Object, name: string, desc: any) {
        defineRequest(target[name], {
            method: RequestMethod.GET,
            path: path,
        });
    }
}

export function Post(path: string) {
    return function (target: Object, name: string, desc: any) {
        defineRequest(target[name], {
            method: RequestMethod.POST,
            path: path,
        });
    }
}

export function Delete(path: string) {
    return function (target: Object, name: string, desc: any) {
        defineRequest(target[name], {
            method: RequestMethod.DELETE,
            path: path,
        });
    }
}

export function Put(path: string) {
    return function (target: Object, name: string, desc: any) {
        defineRequest(target[name], {
            method: RequestMethod.PUT,
            path: path,
        });
    }
}

export function Patch(path: string) {
    return function (target: Object, name: string, desc: any) {
        defineRequest(target[name], {
            method: RequestMethod.PATCH,
            path: path,
        });
    }
}

/**
 * 参数装饰器
 * @constructor
 */
export function PathVariable(key: string, convert?: ParamConvert | ParamType) {
    return function (target: Object, name: string, index: number) {
        if (typeof convert === 'number') {
            convert = { type: convert }
        }
        const metadata = Reflect.getMetadata(MetaKey.METHOD_PARAM, target[name]);
        let arr = [{ index, key, convert }];
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
export function Query(convert?: ParamConvert | ParamType) {
    return function (target: Object, name: string, index: number) {
        if (typeof convert === 'number') {
            convert = { type: convert }
        }
        Reflect.defineMetadata(MetaKey.QUERY, { index, convert }, target[name]);
    }
}

/**
 * 注入body参数
 * @constructor
 */
export function Body(convert?: ParamConvert | ParamType) {
    return function(target: Object, name: string, index: number) {
        if (typeof convert === 'number') {
            convert = { type: convert }
        }
        Reflect.defineMetadata(MetaKey.BODY, { index, convert }, target[name]);
    }
}

/**
 * 装饰 Service
 * @constructor
 */
export function Service() {
    return function (target: Constructor) {
        defineComponent(target);
    }
}

/**
 * 装饰 Component
 * @constructor
 */
export function Component() {
    return function (target: Constructor) {
        defineComponent(target);
    }
}

/**
 * 注入服务
 * @constructor
 */
export function Autowrite(n?: string) {
    return function (target: Object, name: string) {
        target[name] = null;
        Reflect.defineMetadata(MetaKey.INJECT, { target, name: n || name }, target, name);
    }
}

/**
 * 拦截器
 * @param path 拦截器的拦截地址 不传 拦截全部
 */
export function Interceptor(path?: string) {
    return function (target: Constructor) {
        Reflect.defineMetadata(MetaKey.INTERCEPTOR_HANDLER,
            {
                rules: path ? Path2Regexp.pathToRegexp(path) : null,
                type: MetaKey.INTERCEPTOR_HANDLER,
            },
            target);
    }
}

/**
 * 全局异常处理器
 */
export function ErrorHandler() {
    return function (target: Constructor) {
        Reflect.defineMetadata(MetaKey.ERROR_HANDLER,
            {
                rules: undefined,
                type: MetaKey.ERROR_HANDLER,
            },
            target);
    }
}

/**
 * 注册定时任务
 * @constructor
 */
export function Schedule(rule: ScheduleRule) {
    return function (target: Constructor) {
        Reflect.defineMetadata(MetaKey.SCHEDULE,
            {
                rule: rule,
                type: MetaKey.SCHEDULE,
            },
            target);
        defineComponent(target);
    }
}
