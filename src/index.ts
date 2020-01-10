import {Application} from "./libs/Application";
import {ApplicationConfig} from "./libs/config/ApplicationConfig";
import {Interceptor} from "./libs/Interceptor/Interceptor";

class Config extends ApplicationConfig {
    public port: number = 9090;
    public service: string = 'service';
}

class LoginInterceptor extends Interceptor {
    public url: string = "*";
    public before(params: any, req: any, res: any): boolean {
        return true;
    }
}

class RulesInterceptor extends Interceptor {
    public url: string = "/user";
    public before(params: any, req: any, res: any): boolean {
        console.log("已经拦截/user下面的请求");
        console.log(params);
        return true;
    }
}

class App extends Application {
    constructor() {
        super(__dirname);
    }
}

new App()
    .addApplicationConfig(Config)
    .addInterceptor(new LoginInterceptor())
    .addInterceptor(new RulesInterceptor())
    .start();
