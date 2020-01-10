// @ts-ignore
import {ApplicationConfig, Application, Interceptor, EntryApplication} from "./libs/dist";

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
        console.log("拦截 user");
        return true;
    }
}

@EntryApplication
class App extends Application {
    constructor() {
        super(__dirname);
    }

    public addConfig(application: Application): Application {
        application
            .addApplicationConfig(Config)
            .addInterceptor(new LoginInterceptor())
            .addInterceptor(new RulesInterceptor());
        return application;
    }
}
