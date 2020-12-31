import {WorkerMessagePayload, WorkerType} from "./worker";
import {Worker} from "cluster";

const cluster = require("cluster");
const EventEmitter = require("events").EventEmitter;

export default class SummerWorker extends EventEmitter {

    public static readonly WORKER_EXIT = "worker-exit";

    public worker: Worker;

    constructor(opts: any = {}) {
        super();
        this.worker = cluster.fork({ SUMMER_WORKER_TYPE: opts.type }) as Worker;
        this.worker.on("exit", this.onExit.bind(this));
        this.worker.on("message", this.onMessage.bind(this));
    }

    private onExit(code: number, signal: string) {
        this.emit(SummerWorker.WORKER_EXIT, { code, signal });
    }

    private onMessage(data: WorkerMessagePayload) {
        this.emit(data.type, data.data);
    }
}
