import {Controller, RequestMapping, AutoWriteService, RequestMethod, HttpRequest, HttpResponse} from "../node-spring";
import {UserService} from "../service/UserService";
import {ResParams, ResponseStatus} from "../model/Response";
import {User} from "../model/User";

@Controller("/user")
class UserController {

    @AutoWriteService()
    protected UserService: UserService;

    @RequestMapping("list", RequestMethod.GET)
    public list(params: any, req: HttpRequest, res: HttpResponse): ResParams<User[]> {
        // console.log(this.UserService.list());

        return new ResParams<User[]>(ResponseStatus.SUCCESS, this.UserService.list());
    }
}

