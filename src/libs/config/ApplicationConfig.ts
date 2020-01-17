import ApplicationConfigType from "../types/ApplicationConfig";

/**
 * 默认的配置信息
 */
export abstract class ApplicationConfig implements ApplicationConfigType {
    // 端口
    public port: number = 8080;
    // 控制器所在目录 默认 /src/controller
    public controller: string = "controller";
    // Service所在目录 默认 /src/service
    public service: string = "service";
    public resourceDir: string = "src";
}
