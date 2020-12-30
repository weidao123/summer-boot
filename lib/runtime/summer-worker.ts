import {WorkerMessagePayload, WorkerStatus} from "./worker";
import {Worker as AgentWorker} from "cluster";
import {WorkerMessage} from "../util/worker-message";

const cluster = require("cluster");
const EventEmitter = require("events").EventEmitter;

/**
 * agent
 */
export default class SummerWorker extends EventEmitter {

    public static readonly WORKER_STARTED = "worker-started";
    public static readonly WORKER_STARTED_FAIL = "worker-started-fail";
    public static readonly WORKER_EXIT = "worker-exit";

    public worker: AgentWorker;

    constructor(opts = {}) {
        super();
        this.worker = cluster.fork(opts);
        this.worker.on("exit", this.onExit.bind(this));
        WorkerMessage.once(this.worker, WorkerStatus.START_SUCCESS, this.onStart.bind(this));
        WorkerMessage.once(this.worker, WorkerStatus.START_FAIL, this.onStartFail.bind(this));
    }

    private onStart(data: WorkerMessagePayload) {

        this.emit(SummerWorker.WORKER_STARTED, this.worker);
    }

    private onStartFail(data: WorkerMessagePayload) {
        this.emit(SummerWorker.WORKER_STARTED_FAIL, { worker: this.worker, msg: data.data });
    }

    private onExit(code: number, signal: string) {
        this.emit(SummerWorker.WORKER_EXIT, { code, signal });
    }
}
