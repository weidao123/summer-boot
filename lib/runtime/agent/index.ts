import {sendMessage, WorkerStatus} from "../worker";
import {loadSchedule} from "./schedule";

export function initAgent() {
    try {
        loadSchedule();
        sendMessage(WorkerStatus.AGENT_START_SUCCESS);
    } catch (e) {
        sendMessage(WorkerStatus.START_FAIL, e.message);
    }
}

export * from "./schedule";
