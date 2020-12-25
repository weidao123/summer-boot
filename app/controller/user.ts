import {Controller, RequestMapping} from "../../lib";

@Controller({path: "/user"})
export default class UserController {

    @RequestMapping({path: "/name"})
    public name() {
        return "weidao";
    }
}
