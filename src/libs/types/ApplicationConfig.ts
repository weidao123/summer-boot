export default abstract class ApplicationConfigType {
    port: number;

    // 控制器所在目录
    controller: string;

    // service 所在目录
    service: string;

    // 源码所在目录 default: src
    resourceDir: string
}
