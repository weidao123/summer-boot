import {Controller, RequestMapping} from "../../decorator";
import {RequestMethod} from "../../utils";

@Controller("/user")
class User {
    @RequestMapping("list", RequestMethod.GET)
    public getList(params: any, req: any, res: any) {
        return {
            message: "success list",
            data: {},
            code: 1
        };
    }

    @RequestMapping("submit", RequestMethod.POST)
    public submit(params: any, req: any, res: any) {
        return {
            message: "success submit",
            data: {},
            code: 1
        };
    }
}
