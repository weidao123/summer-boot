// @ts-ignore
import {AutoWriteService, Controller, RequestMapping, RequestMethod} from "../libs/dist";
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
