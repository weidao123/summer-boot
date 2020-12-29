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

        WorkerMessage.once(this.agent, WorkerStatus.AGENT_START_SUCCESS, this.onAgentStart);
        WorkerMessage.once(this.agent, WorkerStatus.START_FAIL, this.onAgentStartFail);
    }

    private onAgentStartFail(data: WorkerMessagePayload) {
        Logger.error("Agent start fail " + data.data);
        process.exit(1);
    }

    private onAgentStart(data: WorkerMessagePayload) {
        Logger.info(`Agent start pid ${this.agent.process.pid}`);

        for (let i = 0; i < this.conf.worker; i++) {
            const worker = cluster.fork();
            this.workers.push(worker);
            WorkerMessage.once(worker, WorkerStatus.START_SUCCESS, this.onWorkerStart);
        }
        cluster.on("exit", this.onWorkerExit);
    }

    private onWorkerStart(data: WorkerMessagePayload<number>) {
        this.count++;
        if (this.count === this.conf.worker && !this.isStart) {
            this.isStart = true;
            Logger.info(`Workers: [${this.workers.map(w => w.process.pid)}]`);
            Logger.info(`Master: [${process.pid}]`);
            Logger.info("Application running hare http://127.0.0.1:" + this.conf.port);
        }
    }

    private onWorkerExit(worker: ClusterWorker, code: number, signal: string) {
        if (this.isStart) {
            const index = this.workers.findIndex(w => w.process.pid === worker.process.pid);
            this.workers.splice(index, 1);
            const w = cluster.fork({ NODE_WORK_TYPE: Worker.WORKER });
            this.count--;
            this.workers.push(w);
            WorkerMessage.on(w, WorkerStatus.START_SUCCESS, this.onWorkerStart);

            Logger.warning(`Worker pid=${worker.process.pid} exit, code ${code}, signal ${signal}`);
            Logger.info("fork worker pid " + w.process.pid);
        } else {
            Logger.error(`worker start fail pid ${worker.process.pid}`);
        }
    }

    private onMasterSignal() {}

    private onAgentExit() {}
}
