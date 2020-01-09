import ApplicationConfigType from "../types/ApplicationConfig";
import {ApplicationConfig} from "./ApplicationConfig";

class Container {
    public applicationConfig: ApplicationConfigType;

    public setConfig(handle: any): void {
        const target: ApplicationConfig = new handle();
        if (!(target instanceof ApplicationConfig)) {
            throw new Error("config class must extends ApplicationConfig");
        }

        this.applicationConfig = target;
    }

    public getConfig(): Container {
        return this;
    }


}

export const ApplicationContainer: Container = new Container();
