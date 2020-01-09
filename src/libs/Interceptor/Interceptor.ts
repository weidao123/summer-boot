export abstract class Interceptor {
    /**
     * 要拦截的地址 （控制器的类路径： /user）
     */
    public abstract url: string;
    /**
     * 接收到请求 但是在进入方法之前 返回false终止掉请求
     * @param params
     * @param req
     * @param res
     */
    public abstract before(params: any, req: any, res: any): boolean;
    // public abstract after(params: any, req: any, res: any): void;
}
