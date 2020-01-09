import ApplicationConfigType from "../types/ApplicationConfig";

/**
 * 默认的配置信息
 */
export abstract class ApplicationConfig implements ApplicationConfigType {
    public port: number = 8080;
}
