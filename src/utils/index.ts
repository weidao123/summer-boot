import {RequestType} from "../types";
import ControllerContainer from "../container/container";

export class RequestMethod{
    public static GET: RequestType = "GET";
    public static POST: RequestType = "POST";
    public static DELETE: RequestType = "DELETE";
    public static PUT: RequestType = "PUT";
    public static PATCH: RequestType = "PATCH";
    public static OPTIONS: RequestType = "OPTIONS";
}

export {
    ControllerContainer
}
