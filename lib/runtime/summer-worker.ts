import {WorkerMessagePayload, WorkerMessageType, WorkerType} from "./worker";
import {Worker, Address} from "cluster";
import Logger from "../util/logger";

const cluster = require("cluster");
const EventEmitter = require("events").EventEmitter;

export default class SummerWorker extends EventEmitter {

    public static readonly WORKER_EXIT = "worker-exit";

    public worker: Worker;
    public type: WorkerType;

    constructor(opts: any = {}) {
        super();
        this.worker = cluster.fork({ SUMMER_WORKER_TYPE: opts.type }) as Worker;
        this.type = opts.type;
        this.worker.on("exit", this.onExit.bind(this));
        this.worker.on("message", this.onMessage.bind(this));
        this.worker.on("listening", this.listening.bind(this));
        this.worker.on("disconnect", this.disconnect.bind(this));
        this.worker.on("error", this.error.bind(this));
        this.worker.on("close", this.close.bind(this));
        this.worker.on("online", this.online.bind(this));
        this.worker.on("uncaughtException", this.uncaughtException.bind(this));
    }

    public send(data: WorkerMessagePayload) {
        this.worker.send(data);
    }

    private uncaughtException(err: Error, origin) {
        Logger.error(`worker [uncaughtException] pid ${this.worker.process.pid} type ${this.type}`);
        Logger.error(err);
        Logger.error(origin);
    }

    private close(code, signal) {
        Logger.warning(`worker [closed] pid ${this.worker.process.pid} type ${this.type} code ${code} signal ${signal}`);
    }

    private online() {
        Logger.info(`worker [online] pid ${this.worker.process.pid} type ${this.type}`);
    }

    private disconnect() {
        Logger.warning(`worker [disconnect] pid ${this.worker.process.pid} type ${this.type}`);
    }

    private listening(address: Address) {
        Logger.info(`worker [listening] pid ${this.worker.process.pid} type ${this.type}`);
        this.emit(WorkerMessageType.WORKER_LISTEN, address);
    }

    private error() {
        Logger.error(`worker [error] pid ${this.worker.process.pid} type ${this.type}`);
    }

    private onExit(code: number, signal: string) {
        Logger.error(`worker [exit] pid ${this.worker.process.pid} type ${this.type} code ${code} signal ${signal}`);
        this.emit(SummerWorker.WORKER_EXIT, this.worker, code, signal);
    }

    private onMessage(data: WorkerMessagePayload) {
        if (data.type !== undefined) {
            this.emit(data.type, data);
        }
    }
}
