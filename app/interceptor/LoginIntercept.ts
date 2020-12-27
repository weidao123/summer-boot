import {Autowrite, Interceptor} from "../../lib";
import {Request, Response} from "express";
import {InterceptorHandler} from "../../lib";
import BaseService from "../service/BaseService";

@Interceptor('/front/(.*)')
export default class LoginInterceptor implements InterceptorHandler {

    @Autowrite()
    private baseService: BaseService;

    after(req: Request, res: Response, data: any): Object {
        console.log(this.baseService.getPath());
        return {"state": 200, msg: "success", data: data};
    }

    before(req: Request, res: Response): boolean {
        return true;
    }
}
