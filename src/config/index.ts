import {ApplicationConfig} from "../node-spring";

export class Config extends ApplicationConfig {
    public port: number = 9090;
    public service: string = 'service';
}
