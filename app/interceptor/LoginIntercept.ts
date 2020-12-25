import {Interceptor} from "../../lib";
import {Request, Response} from "express";
import {InterceptorHandler} from "../../lib";

@Interceptor('/front/(.*)')
export default class LoginInterceptor implements InterceptorHandler {
    after(req: Request, res: Response, data: any): Object {
        console.log(data);
        return {"state": 200, msg: "success", data: null};
    }

    before(req: Request, res: Response): boolean {
        console.log("aaaaaaaa");
        return false;
    }

}
