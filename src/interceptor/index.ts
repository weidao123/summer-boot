import {Interceptor} from "../node-spring-mvc";

export class LoginInterceptor extends Interceptor {
    public url: string = "*";

    public before(params: any, req: any, res: any): boolean {
        return true;
    }
}

export class RulesInterceptor extends Interceptor {
    public url: string = "/user";

    public before(params: any, req: any, res: any): boolean {
        console.log("拦截 user");
        return true;
    }
}
