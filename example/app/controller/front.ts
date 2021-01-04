import {Autowrite, Controller, Get, Post, RequestMapping} from "summer-boot";

@Controller({path: "/front"})
export default class FrontController {

    @Autowrite("RandomInt")
    private randomInt;

    @Get("/name")
    public pname() {
        return {
            pid: process.pid,
            env: process.env.NODE_ENV
        };
    }
}
