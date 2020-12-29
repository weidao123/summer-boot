import {Request, Response} from "express";
import {ErrorHandler, ExceptionHandler} from "../../lib";

@ErrorHandler()
export default class GlobalErrorHandler implements ExceptionHandler {
    public exception(req: Request, res: Response, e: Error) {
        res.send({
            msg: e.message,
            data: null,
            code: 1
        });
    }
}
