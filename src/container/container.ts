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

        parent = "/" + parent.replace(/\//, "");

        if(!this.Container[parent]) {
            this.Container[parent] = {};
        }
        this.Container[parent] = new target();
    }

    public async getMethod(parent: string, path: string, params: any, req: any, res: any) {
        const parents: any = this.Container[parent].constructor.prototype;
        const keys: string[] = Object.getOwnPropertyNames(parents);
        for (let key of keys) {
            if(parents[key].PATH && parents[key].PATH === path) {
                return await parents[key](params, req, res);
            }
        }
        return null;
    }
}

export default new ControllerContainer();
