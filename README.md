### summer-boot

一款类基于DI(依赖注入)和IOC(控制反转)的NodeJS框架，模块间高内聚低耦合

并集成了vue-ssr只需要少量的配置即可开启vue的ssr渲染，Demo可参考下面连接

[vue-ssr-template](https://github.com/weidao123/vue-ssr-template)

### 说明

* 默认会扫描*/app*目录下的所有组件
* 如需要在应用启动前或启动后做一些初始化工作，可在 */app/application.ts* 这个文件里面实现 *StarterHandler* 接口
* 应用启动时默认会启动一个Master进程以及Agent进程和cpu核数的Worker进程（这个可在配置文件中覆盖）
* 应用启动前会加载 */summer-boot.json* 这个配置文件，可用来覆盖默认的一些配置

#### 装饰器

* [x] 

* [x] Service (服务，可被Autowrite注入)
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

