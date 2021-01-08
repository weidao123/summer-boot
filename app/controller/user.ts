import {Controller, Env, Get, PathVariable, Post, Query} from "../../dist";
import {Body, ParamType} from "../../lib";

class User {
    name: number;
}

@Controller()
export default class UserController {
    @Get("/list/:id")
    public list(@PathVariable("id", ParamType.number) id: number) {
        return ["张三", id, Env.development];
    }

    @Get("/list")
    public query(@Query(ParamType.object) query: User) {
        console.log(query);
        return query;
    }

    @Post("/post")
    public post(@Body({type: ParamType.entity, entity: User}) body: User) {
        console.log(body);
        return body;
    }
}
