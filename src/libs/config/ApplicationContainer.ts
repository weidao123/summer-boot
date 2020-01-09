import ApplicationConfigType from "../types/ApplicationConfig";
import {ApplicationConfig} from "./ApplicationConfig";

class Container implements ApplicationConfigType{
    public port: number;

    public setConfig(handle: any): void {
        const target: ApplicationConfig = new handle();
        if (!(target instanceof ApplicationConfig)) {
            throw new Error("config class must extends ApplicationConfig");
        }

        this.port = target.port;
    }

    public getConfig(): Container {
        return this;
    }
}

export const ApplicationContainer: Container = new Container();
