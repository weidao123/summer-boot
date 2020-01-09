import {RequestType} from "../types";
import {ControllerContainer, RequestMethod} from "../utils";
import ServiceContainer from "../container/service";

/**
 * 控制器里面的方法路由的装饰器
 * @param path
 * @param method
 * @constructor
 */
export function RequestMapping(path: string, method: RequestType = RequestMethod.GET) {
    return function (target: any, name?: string | any, desc?: any) {

        //装饰于方法
        if(typeof target === 'object') {
            desc.value.PATH = path.replace("/", "");
            desc.value.METHOD = method;
        }

        //装饰于类上
        if(typeof target === 'function') {
            return  {};
        }
    }
}

/**
 * 控制器的装饰器
 * @param path
 * @constructor
 */
export function Controller(path: string) {
    return function (target: any) {
        let names: string[] = Object.getOwnPropertyNames(target.prototype);
        names.forEach((key: string) => {
            let method: any = target.prototype[key];
            let requestMethod: RequestType = method.METHOD;
            let methodPath = method.PATH;
            if(typeof method === 'function' && key !== 'constructor' && methodPath) {
                ControllerContainer.addMethod(requestMethod, path, methodPath, target);
            }
        });
        return new target();
    }
}

/**
 * Service服务的装饰器
 * @param serviceName
 * @constructor
 */
export function Service(serviceName: string) {
    return function (target: any) {
        ServiceContainer.addService(serviceName, new target());
    }
}

/**
 * 注入Service服务的装饰器
 * @param serviceName
 * @constructor
 */
export function AutoWriteService(serviceName?: string) {
    return function (target: any, name: string) {
        target[name] = ServiceContainer.getService(serviceName || name);
    }
}
