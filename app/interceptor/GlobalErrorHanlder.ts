import {ErrorHandler, ExceptionHandler} from "../../lib";

@ErrorHandler()
export default class GlobalErrorHandler implements ExceptionHandler {
    public exception(req, res, e) {
        res.send("global exception handler -->" + e);
    }
}
