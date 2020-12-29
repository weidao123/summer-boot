## summer-boot

一款类基于DI(依赖注入)和IOC(控制反转)的NodeJS框架，模块间高内聚低耦合

并集成了vue-ssr只需要少量的配置即可开启vue的ssr渲染，Demo可参考下面连接

[vue-ssr-template](https://github.com/weidao123/vue-ssr-template)

### 安装

```javascript
yarn add summer-boot
```

```json
// package.json 在script启动脚本添加命令
{
    "script": {
        "satrt": "summer-boot"
    }
}
```



### 说明

* 默认会扫描*/app*目录下的所有组件
* 如需要在应用启动前或启动后做一些初始化工作，可在 */app/application.ts* 这个文件里面实现 *StarterHandler* 接口
* 应用启动时默认会启动一个Master进程以及Agent进程和cpu核数的Worker进程（这个可在配置文件中覆盖）
* 应用启动前会加载 */summer-boot.json* 这个配置文件，可用来覆盖默认的一些配置

#### 装饰器

* [x] Service (装饰一个服务，可被Autowrite注入)
* [x] ErrorHandler (全局异常处理器)
* [x] Component (组件，可被Autowrite注入)
* [x] Autowrite (注入组件)
* [x] Controller (控制器路由映射)
* [x] Interceptor (请求/响应拦截器)
* [x] RequestMapping (映射方法路由)
* [x] Req (注入Express 的 Request对象)
* [x] Res (注入Express 的 Response 对象)
* [x] Query (注入接收到的query参数)
* [x] Body (注入接收到的body参数)
* [x] PathVariable (注入url上的参数)
* [x] Get、Post、Put、Delete、Patch

### Example

* */app/controller/user.ts*

```typescript
import {
    Autowrite, Body,
    Controller,
    Delete,
    Get,
    Patch,
    PathVariable,
    Post,
    Put, Query,
    Req,
    RequestMapping,
    RequestMethod
} from "summer-boot";
import BaseService from "../service/BaseService";
import {Request} from "express";

@Controller({path: "/user"})
export default class UserController {

    // 可以通过名称、或者类型注入
    @Autowrite()
    private baseService: BaseService;

    @Get("/test2/:id")
    public test2(@PathVariable("id") id: string) {
        return { id };
    }

    @Get("/test1")
    public test1(@Req req: Request) {
        return {
            data: this.baseService.getPath(),
            ip: req.ip,
        };
    }

    @RequestMapping({ path: "/postmapping", method: RequestMethod.POST })
    public postMapping(@Body body) {
        return {
            data: body
        };
    }

    @RequestMapping("/getmapping")
    public getMapping(@Query query) {
        return {
            data: query
        };
    }

    @Get("/get")
    public get() {
        return "get";
    }

    @Post("/post")
    public post() {
        return "post";
    }

    @Put("/put")
    public put() {
        return "put";
    }

    @Patch("/patch")
    public patch() {
        return "patch";
    }

    @Delete("/delete")
    public del() {
        return "delete";
    }
}

```

* */app/interceptor/login-interceptor.ts*

```typescript
import {Autowrite, Interceptor, InterceptorHandler} from "summer-boot";
import {Request, Response} from "express";
import BaseService from "../service/BaseService";

// 拦截器： 拦截/front/* 的所有请求
// 不传参数代表拦截所有
@Interceptor('/front/(.*)')
export default class LoginInterceptor implements InterceptorHandler {

    @Autowrite()
    private baseService: BaseService;

    // 响应前处理
    after(req: Request, res: Response, data: any): Object {
        console.log(this.baseService.getPath());
        return {"state": 200, msg: "success", data: data};
    }

    // 前置拦截
    before(req: Request, res: Response): boolean {
        return true;
    }
}
```

* */app/interceptor/global-exception.ts*

```typescript
import {ErrorHandler, ExceptionHandler} from "summer-boot";

// 全局异常处理
@ErrorHandler()
export default class GlobalErrorHandler implements ExceptionHandler {
    // 统一返回异常信息
    public exception(req, res, e) {
        res.send("global exception handler -->" + e);
    }
}
```