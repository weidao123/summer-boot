import {Controller, RequestMapping, AutoWriteService} from "../../decorator";
import {RequestMethod} from "../../utils";

@Controller("/user")
export default class User {

    @AutoWriteService("UserService")
    private userService: any;

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
