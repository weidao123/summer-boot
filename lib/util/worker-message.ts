import {Worker as ClusterWorker} from "cluster";
import {WorkerMessagePayload, WorkerStatus} from "../runtime/worker";

type Callback<T = WorkerMessagePayload> = (data: T) => void;

export class WorkerMessage<T> {

    public static once<T>(worker: ClusterWorker, type: WorkerStatus, call: Callback) {
        worker.once("message", (data) => this.handler(data, type, call));
    }

    public static on<T>(worker: ClusterWorker, type: WorkerStatus, call: Callback) {
        worker.on("message", (data) => this.handler(data, type, call));
    }

    private static handler(data: WorkerMessagePayload, type: WorkerStatus, call: Callback) {
        if (data.type === type) {
            call(data);
        }
    }
}
