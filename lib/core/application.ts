import Loader from "../util/loader";
import ParserDecorate from "../util/parser-decorate";
import {invoke} from "./invoke";
import {Config, StarterHandler} from "./config";
import {sendMessage, WorkerStatus} from "../runtime/worker";

const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");

const app = express();
const workDir = process.cwd();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * 用于初始化一些数据 以及对外提供抽象生命周期方法
 */
export default class Application {

    // 全局配置
    private readonly starterHandler: StarterHandler;

    constructor() {
        // 全局配置
        const {baseDir, starterHandlerFile, staticDir} = Config.getConfig();

        // 静态资源目录
        app.use(express.static(path.resolve(workDir, staticDir)));

        // 加载 App生命周期
        const staterHandlerPath = path.resolve(workDir, starterHandlerFile);
        const Handle = Loader.loadFile(Loader.getPathAsExtname(staterHandlerPath));
        this.starterHandler = Handle ? new Handle() : null;

        // 加载工作目录的所有组件
        const base = Loader.load(path.resolve(workDir, baseDir));

        // 解析加载的组件
        ParserDecorate.parser(base);

        // 注入服务
        ParserDecorate.parserAutowrite();
    }

    public listen() {
        if (this.starterHandler) {
            this.starterHandler.before && this.starterHandler.before(app);
        }
        app.all("*", invoke);
        const port = Config.getConfig().port;
        app.listen(port, () => {
            if (this.starterHandler)
            this.starterHandler.after && this.starterHandler.after(app);
            // 通知主进程 启动成功
            sendMessage(WorkerStatus.START_SUCCESS);
        });
    }

}
