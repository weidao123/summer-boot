import {Controller, Get, Env} from "../../dist";

@Controller()
export default class UserController {
    @Get("/list")
    public list() {
        return ["张三", "李四", "王五", Env.development];
    }
}
