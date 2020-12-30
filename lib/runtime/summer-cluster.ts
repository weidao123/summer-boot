import {Worker, WorkerMessagePayload, WorkerStatus} from "./worker";
import {Worker as ClusterWorker} from "cluster";
import {WorkerMessage} from "../util/worker-message";
import {Config} from "..";
import Logger from "../util/logger";

const cluster = require("cluster");

/**
 * 集群模式启动
 */
export default class SummerCluster {

    private readonly agent: ClusterWorker;
    private readonly workers: ClusterWorker[] = [];
    private readonly conf: any;
    private count: number = 0;
    private isStart = false;

    constructor() {
        this.conf = Config.getConfig();
        this.agent = cluster.fork({ NODE_WORK_TYPE: Worker.AGENT });
        Logger.info(`Master start ${process.pid}`);

        WorkerMessage.once(this.agent, WorkerStatus.AGENT_START_SUCCESS, this.forkWorker.bind(this));
        WorkerMessage.once(this.agent, WorkerStatus.START_FAIL, this.onAgentStartFail.bind(this));
        this.agent.on("exit", this.onAgentExit.bind(this))
    }

    /**
     * 监听agent启动失败
     * @param data
     */
    private onAgentStartFail(data: WorkerMessagePayload) {
        process.exit(1);
    }

    /**
     * 监听agent exit
     */
    private onAgentExit(code, signal) {
        Logger.error(`Agent exit code ${code} signal ${signal}`);
        process.exit(1);
    }

    /**
     * fork 子进程
     * @param data
     */
    private forkWorker(data: WorkerMessagePayload) {
        for (let i = 0; i < this.conf.worker; i++) {
            const worker = cluster.fork();
            this.workers.push(worker);
            worker.on('exit', (code, signal) => this.onWorkerExit(worker, code, signal));
            WorkerMessage.once(worker, WorkerStatus.START_SUCCESS, this.onWorkerStart.bind(this));
        }
    }

    /**
     * 监听子进程启动
     * @param data
     */
    private onWorkerStart(data: WorkerMessagePayload<number>) {
        this.count++;
        Logger.info(`Worker start ${data.data}`);
        if (this.count === this.conf.worker) {
            if (!this.isStart) {
                this.isStart = true;
                Logger.info("Application running hare http://127.0.0.1:" + this.conf.port);
            }
        }
    }

    /**
     * 监听子进程exit、并启动新的子进程
     * @param worker
     * @param code
     * @param signal
     */
    private onWorkerExit(worker: ClusterWorker, code: number, signal: string) {
        if (this.isStart) {
            const index = this.workers.findIndex(w => w.process.pid === worker.process.pid);
            this.workers.splice(index, 1);
            const w = cluster.fork({ NODE_WORK_TYPE: Worker.WORKER });
            this.count--;
            this.workers.push(w);
            WorkerMessage.on(w, WorkerStatus.START_SUCCESS, this.onWorkerStart.bind(this));

            Logger.error(`Worker pid=${worker.process.pid} exit, code ${code}, signal ${signal}`);
        } else {
            Logger.error(`worker exit pid ${worker.process.pid}`);
        }
    }
}
