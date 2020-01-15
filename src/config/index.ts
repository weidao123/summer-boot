import {ApplicationConfig} from "../node-spring-mvc";

export class Config extends ApplicationConfig {
    public port: number = 9090;
    public service: string = 'service';
}
