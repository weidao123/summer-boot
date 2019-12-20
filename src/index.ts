import {Application} from "./common/Application";
import {InitConfigParams} from "./types";

// import "./controller/UserController";

class Main extends Application {
    constructor() {
        super();
    }

    /**
     * @override
     */
    public config(): InitConfigParams {
        return {
            port: 8088,
            message: "[running info] your application run success, href http://localhost:8088"
        };
    }
}

new Main();
