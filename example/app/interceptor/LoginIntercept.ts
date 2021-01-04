import {Autowrite, Interceptor, InterceptorHandler} from "summer-boot";
import {Request, Response} from "express";
import BaseService from "../service/BaseService";

@Interceptor('/front/(.*)')
export default class LoginInterceptor implements InterceptorHandler {

    @Autowrite()
    private baseService: BaseService;

    after(req: Request, res: Response, data: any): Object {
        return {"state": 200, msg: "success", data: data};
    }

    before(req: Request, res: Response): boolean {
        return true;
    }
}
