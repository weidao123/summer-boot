import {Controller, RequestMapping, AutoWriteService} from "../decorator";
import {RequestMethod} from "../utils";
import {UserService} from "../service/UserService";
import {ResParams, ResponseStatus} from "../model/Response";
import {User} from "../model/User";

@Controller("/user")
export default class UserController {

    @AutoWriteService()
    protected UserService: UserService;

    @RequestMapping("list", RequestMethod.GET)
    public list(params: any, req: any, res: any): ResParams<any> {
        // console.log(this.UserService.list());
        // console.log("被访问了");
        return new ResParams<User[]>(ResponseStatus.SUCCESS, this.UserService.list());
    }
}
