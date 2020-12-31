import {WorkerType, WorkerMessagePayload, WorkerMessageType} from "./worker";
import {Worker} from "cluster";
import {Config} from "..";
import Logger from "../util/logger";
import SummerWorker from "./summer-worker";

const pkg = require("../../package.json");

/**
 * 集群模式启动
 */
export default class SummerCluster {

    private readonly workers: SummerWorker[] = [];
    private readonly conf: any;
    private agent: SummerWorker;

    private count: number = 0;
    private isStart = false;

    constructor() {
        Logger.info(`[master] node version ${process.version} summer-boot version ${pkg.version}`);
        this.conf = Config.getConfig();
        this.agent = new SummerWorker({ type: WorkerType.AGENT });

        this.agent.on(WorkerMessageType.START_SUCCESS, () => {
            this.forkWorker();
            Logger.info(`agent started`);
        });

        this.agent.on(WorkerMessageType.START_FAIL, (data) => {
            Logger.error(`agent started error ${data.data}`);
            process.exit();
        });

        this.agent.on(SummerWorker.WORKER_EXIT, () => {
            Logger.error(`agent exit`);
            process.exit();
        });
    }

    /**
     * fork 子进程
     */
    private forkWorker() {
        for (let i = 0; i < this.conf.worker; i++) {
            const worker = new SummerWorker({ type: WorkerType.WORKER });
            this.workers.push(worker);
            worker.on(SummerWorker.WORKER_EXIT, (code, signal) => this.onWorkerExit(worker.worker, code, signal));
            worker.once(WorkerMessageType.START_SUCCESS, this.onWorkerStart.bind(this));
        }
    }

    /**
     * 监听子进程启动
     * @param data
     */
    private onWorkerStart(data: WorkerMessagePayload<number>) {
        this.count++;
        if (this.count === this.conf.worker) {
            if (!this.isStart) {
                this.isStart = true;
                Logger.info(`workers started ${this.workers.map(w => w.worker.process.pid)}`);
                Logger.info("application running hare http://127.0.0.1:" + this.conf.port);
            }
        }
    }

    /**
     * 监听子进程exit、并启动新的子进程
     * @param worker
     * @param code
     * @param signal
     */
    private onWorkerExit(worker: Worker, code: number, signal: string) {
        if (this.isStart) {
            const index = this.workers.findIndex(w => w.process.pid === worker.process.pid);
            this.workers.splice(index, 1);
            const w = new SummerWorker({ type: WorkerType.WORKER });
            this.count--;
            this.workers.push(w);
            w.on(WorkerMessageType.START_SUCCESS, this.onWorkerStart.bind(this));

            Logger.error(`Worker pid=${worker.process.pid} exit, code ${code}, signal ${signal}`);
        } else {
            Logger.error(`worker exit pid ${worker.process.pid}`);
        }
    }
}
