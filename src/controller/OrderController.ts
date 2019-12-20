import {Controller, RequestMapping} from "../decorator";
import {RequestMethod} from "../utils";

@Controller("/order")
class OrderController {
    @RequestMapping("/list", RequestMethod.GET)
    public orderList() {
        return "ass order list"
    }
}
