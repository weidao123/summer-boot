/**
 * 容器
 */
import {RequestType} from "../types";

interface Container {
    [key: string]: {
        [method: string]: {
            [path: string]: any
        }
    }
}

class ControllerContainer {

    private Container: Container = {};

    public addMethod(method: RequestType, parent: string, path: string, target: any) {

        if(!parent) {
            throw new Error("parent path is required");
        }

        parent = "/" + parent.replace(/\//, "");
        path = "/" + path.replace(/\//, "");

        if(!this.Container[parent]) {
            this.Container[parent] = {};
        }
        if(!this.Container[parent][method]) {
            this.Container[parent][method] = {};
        }
        this.Container[parent][method][path] = target;
    }
}

export default new ControllerContainer();
