import {Controller, RequestMapping} from "../../lib";

@Controller({path: "/front"})
export default class FrontController {

    @RequestMapping({path: "/name"})
    public name() {
        return "front weidao";
    }
}
