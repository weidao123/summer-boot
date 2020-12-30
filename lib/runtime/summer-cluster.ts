import {Worker, WorkerMessagePayload, WorkerStatus} from "./worker";
import {Worker as ClusterWorker} from "cluster";
import {WorkerMessage} from "../util/worker-message";
import {Config} from "..";
import Logger from "../util/logger";
import SummerWorker from "./summer-worker";

const cluster = require("cluster");
const pkg = require("../../package.json");

/**
 * 集群模式启动
 */
export default class SummerCluster {

    private readonly workers: ClusterWorker[] = [];
    private readonly conf: any;
    private agent: SummerWorker;

    private count: number = 0;
    private isStart = false;

    constructor() {
        Logger.info(`node version ${process.version} summer-boot version ${pkg.version}`);
        Logger.info(`master started ${process.pid}`);
        this.conf = Config.getConfig();
        this.agent = new SummerWorker({ NODE_WORK_TYPE: Worker.AGENT });

        this.agent.on(SummerWorker.WORKER_STARTED, (worker) => {
            this.forkWorker();
            Logger.info(`agent started ${worker.process.pid}`);
        });

        this.agent.on(SummerWorker.WORKER_STARTED_FAIL, ({worker, msg}) => {
            Logger.error(`agent started error ${msg}`);
            process.exit();
        });

        this.agent.on(SummerWorker.WORKER_EXIT, (worker) => {
            Logger.error(`agent exit ${worker.process.pid}`);
            process.exit();
        });
    }

    /**
     * fork 子进程
     */
    private forkWorker() {
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
        if (this.count === this.conf.worker) {
            if (!this.isStart) {
                this.isStart = true;
                Logger.info(`workers started ${this.workers.map(w => w.process.pid)}`);
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
