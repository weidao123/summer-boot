import {Application, EntryApplication} from "./node-spring";
import {LoginInterceptor, RulesInterceptor} from "./interceptor";
import {Config} from "./config";

@EntryApplication
class App extends Application {
    constructor() {
        super();
    }

    public addConfig(application: Application): Application {
        application
            .addApplicationConfig(Config)
            .addInterceptor(new LoginInterceptor())
            .addInterceptor(new RulesInterceptor());
        return application;
    }
}

