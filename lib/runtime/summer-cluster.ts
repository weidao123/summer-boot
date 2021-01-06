import {WorkerType, WorkerMessagePayload, WorkerMessageType} from "./worker";
import {Worker, Address} from "cluster";
import {Config} from "..";
import Logger from "../util/logger";
import SummerWorker from "./summer-worker";
import {Env} from "../util";

const ip = require("ip");
const pkg = require("../../package.json");

/**
 * 集群模式启动
 */
export default class SummerCluster {

    private readonly workers: SummerWorker[] = [];
    private readonly conf: any;
    private agent: SummerWorker;

    constructor() {
        Logger.info(`[master] node version ${process.version} summer-boot version ${pkg.version}`);
        Logger.info(`[master] env for ${Env.env}`);
        this.conf = Config.getConfig();
        this.agent = new SummerWorker({
            SUMMER_WORKER_TYPE: WorkerType.AGENT,
            NODE_ENV: Env.env,
        });

        this.agent.on(WorkerMessageType.START_SUCCESS, this.forkWorker.bind(this));
        this.agent.on(SummerWorker.WORKER_EXIT, () => process.exit());
        this.agent.on(WorkerMessageType.START_FAIL, (data) => {
            Logger.error(`agent started error ${data.data}`);
            process.exit();
        });
        this.agent.on(WorkerMessageType.TO_ALL_WORKER, this.agent2worker.bind(this));
    }

    /**
     * 转发给所有的工作进程
     * @param payload
     */
    private agent2worker(payload: WorkerMessagePayload) {
        this.workers.forEach(w => w.send(payload));
    }

    /**
     * 转发给所有的工作进程
     * @param payload
     */
    private worker2agent(payload: WorkerMessagePayload) {
        this.agent.send(payload);
    }

    private forkWorker() {
        for (let i = 0; i < this.conf.worker; i++) { this.fork(); }
    }

    /**
     * fork 子进程
     */
    private fork() {
        const worker = new SummerWorker({
            SUMMER_WORKER_TYPE: WorkerType.WORKER,
            NODE_ENV: Env.env,
        });
        worker.on(SummerWorker.WORKER_EXIT, this.onWorkerExit.bind(this));
        worker.once(WorkerMessageType.WORKER_LISTEN, this.onWorkerListen.bind(this));
        worker.on(WorkerMessageType.TO_AGENT, this.worker2agent.bind(this));
        return worker;
    }

    /**
     * 监听子进程启动
     */
    private onWorkerListen(address: Address, worker: SummerWorker) {
        this.workers.push(worker);
        const isStart = this.workers.length === this.conf.worker;
        if (isStart) {
            Logger.info(`application running hare http://${ip.address()}:${address.port}`);
        }
    }

    /**
     * 监听子进程exit、并启动新的子进程
     * @param worker
     * @param code
     * @param signal
     */
    private onWorkerExit(worker: Worker, code: number, signal: string) {
        if (this.workers.length === this.conf.worker) {
            const index = this.workers.findIndex(w => w.worker.process.pid === worker.process.pid);
            this.workers.splice(index, 1);
            this.fork();
        }
    }
}
