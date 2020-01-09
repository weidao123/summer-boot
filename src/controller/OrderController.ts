import {AutoWriteService, Controller, RequestMapping} from "../decorator";
import {RequestMethod} from "../utils";
import {UserService} from "../service/UserService";

@Controller("/order")
class OrderController {

    @AutoWriteService()
    protected UserService: UserService;

    @RequestMapping("list", RequestMethod.GET)
    public orderList() {
        console.log(this.UserService.list());
        return "ass order list"
    }
}
