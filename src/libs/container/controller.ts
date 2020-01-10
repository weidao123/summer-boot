/**
 * 容器
 */
import {RequestType} from "../types";

interface Container {
    [key: string]: any
}

class ControllerContainer {

    private Container: Container = {};

    public addMethod(method: RequestType, parent: string, path: string, target: any) {
        if(!parent) {
            throw new Error("parent path is required");
        }

        parent = parent.replace(/\//, "");

        if(!this.Container[parent]) {
            this.Container[parent] = {};
        }
        this.Container[parent] = new target();
    }

    /**
     * 根据请求的req.url 获取对应的控制和方法
     * @param params
     * @param req
     * @param res
     */
    public async getMethod(params: any, req: any, res: any) {
        const url = req.url.substring(1).split("?");
        const requestUrl = url[0].split("/");
        // 控制器的路径
        const parent = requestUrl[0];
        // 方法的路径
        const path = requestUrl[1];
        const parents: any = this.Container[parent].constructor.prototype;

        const keys: string[] = Object.getOwnPropertyNames(parents);
        try {
            for (let key of keys) {
                if (parents[key].PATH) {
                    // 方法的访问路径 以及方法路径上参数集合
                    const methodPath = parents[key].PATH.split("/");
                    if(methodPath[0] && methodPath[0] === path) {
                        if (methodPath.length > 1) {
                            // 这里的item为参数名称
                            methodPath.forEach((item: string, index: number) => {
                                // 第0个为方法的访问路径
                                if (index !== 0) {
                                    item = item.replace(":", "");
                                    params[item] = requestUrl[index + 1];
                                }
                            });
                        } else if(methodPath.length === 1 && requestUrl.length !== 2) {
                            return null;
                        }
                        return await parents[key](params, req, res);
                    }
                }
            }
        } catch (e) {
            return null;
        }
    }
}

export default new ControllerContainer();
