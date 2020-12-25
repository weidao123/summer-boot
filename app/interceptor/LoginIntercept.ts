import {Interceptor} from "../../lib";
import {Request, Response} from "express";
import {InterceptorHandler} from "../../lib";

@Interceptor('/front/(.*)')
export default class LoginInterceptor implements InterceptorHandler {
    after(req: Request, res: Response, data: any): Object {
        return {"state": 200, msg: "success", data: data};
    }

    before(req: Request, res: Response): boolean {
        return true;
    }
}
