import {
    Autowrite, Body,
    Controller,
    Delete,
    Get,
    Patch,
    PathVariable,
    Post,
    Put, Query,
    Req,
    RequestMapping,
    RequestMethod
} from "../../lib";
import BaseService from "../service/BaseService";
import {Request} from "express";

@Controller({path: "/user"})
export default class UserController {

    @Autowrite()
    private baseService: BaseService;

    @Get("/test2/:id")
    public test2(@PathVariable("id") id: string) {
        return { id };
    }

    @Get("/test1")
    public test1(@Req req: Request) {
        return {
            data: this.baseService.getPath(),
            ip: req.ip,
        };
    }

    @RequestMapping({ path: "/postmapping", method: RequestMethod.POST })
    public postMapping(@Body body) {
        return {
            data: body
        };
    }

    @RequestMapping("/getmapping")
    public getMapping(@Query query) {
        return {
            data: query
        };
    }

    @Get("/get")
    public get() {
        return "get";
    }

    @Post("/post")
    public post() {
        return "post";
    }

    @Put("/put")
    public put() {
        return "put";
    }

    @Patch("/patch")
    public patch() {
        return "patch";
    }

    @Delete("/delete")
    public del() {
        return "delete";
    }
}
