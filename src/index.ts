import {Application} from "./libs/Application";
import {ApplicationConfig} from "./libs/config/ApplicationConfig";
import {Interceptor} from "./libs/Interceptor/Interceptor";

class Config extends ApplicationConfig {
    public port: number = 9090;
}

class LoginInterceptor extends Interceptor {
    public url: string = "*";
    public before(params: any, req: any, res: any): boolean {
        console.log(req._parentURL);
        return true;
    }
}

class RulesInterceptor extends Interceptor {
    public url: string = "/user";
    public before(params: any, req: any, res: any): boolean {
        res.send("已经拦截/user下面的请求");
        return false;
    }
}

class App extends Application {
    constructor() {
        super();
    }
}

new App().addApplicationConfig(Config)
    .addInterceptor(new LoginInterceptor())
    .addInterceptor(new RulesInterceptor())
    .start();
