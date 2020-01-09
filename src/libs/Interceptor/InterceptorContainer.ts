import {Interceptor} from "./Interceptor";

/**
 * 拦截器的容器
 */
class InterceptorContainer {
    public container: Interceptor[] = [];

    public addInterceptor(interceptor: Interceptor) {
        if (interceptor instanceof Interceptor) {
            this.container.push(interceptor);
        }
    }

    public async checkInterceptor(allParams: any, req: any, res: any): Promise<boolean> {
        for (const key in this.container) {
            const Item = this.container[key];
            let flag: boolean = true;
            if (Item.url === "*" || Item.url === "/" + req._parentURL) {
                flag = await Item.before(allParams, req, res);
            }
            if (!flag) {
                return false;
            }
        }
        return true;
    }
}

export const interceptorContainer = new InterceptorContainer();
