import {Controller, RequestMapping, AutoWriteService} from "../decorator";
import {RequestMethod} from "../utils";
import {UserService} from "../service/UserService";

@Controller("/user")
export default class User {

    @AutoWriteService("UserService")
    protected userService: UserService;

    @RequestMapping("list", RequestMethod.GET)
    public getList({id, name}: any, req: any, res: any) {

        return {
            message: "request params ID=" + id + "NAME:" + name,
            data: this.userService.list(),
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
