import {getWorkerType, sendMessage, WorkerMessageType, WorkerType} from "../worker";
import {loadSchedule} from "./schedule";

export function initAgent() {
    try {
        loadSchedule();
        sendMessage({
            type: WorkerMessageType.START_SUCCESS,
            data: null,
            to: WorkerType.MASTER,
            form: getWorkerType(),
        });
    } catch (e) {
        sendMessage({
            type: WorkerMessageType.START_FAIL,
            data: e.message,
            to: WorkerType.MASTER,
            form: getWorkerType(),
        });
    }
}

export * from "./schedule";
