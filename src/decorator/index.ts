import {RequestType} from "../types";
import {ControllerContainer, RequestMethod} from "../utils";

export function RequestMapping(path: string, method: RequestType = RequestMethod.GET) {
    return function (target: any, name?: string | any, desc?: any) {

        //装饰于方法
        if(typeof target === 'object') {
            desc.value.PATH = path;
            desc.value.METHOD = method;
        }

        //装饰于类上
        if(typeof target === 'function') {
            return  {};
        }

    }
}

export function Controller(path: string) {
    return function (target: any) {
        let names: string[] = Object.getOwnPropertyNames(target.prototype);
        names.forEach((key: string) => {
            let method: any = target.prototype[key];
            let requestMethod: RequestType = method.METHOD;
            let methodPath = method.PATH;
            if(typeof method === 'function' && key !== 'constructor') {
                ControllerContainer.addMethod(requestMethod, path, methodPath, method);
            }
        });
        return  target;
    }
}
