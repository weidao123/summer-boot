import {Autowrite, Controller, RequestMapping} from "../../lib";

@Controller({path: "/front"})
export default class FrontController {

    @Autowrite("RandomInt")
    private randomInt;

    @RequestMapping({path: "/name"})
    public name() {
        return "front-" + this.randomInt.get() + "pid=" + process.pid;
    }
}
