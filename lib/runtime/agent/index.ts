import {sendMessage, WorkerStatus} from "../worker";
import {loadSchedule} from "./schedule";
import Logger from "../../util/logger";

export function initAgent() {
    try {
        loadSchedule();
        sendMessage(WorkerStatus.START_SUCCESS);
    } catch (e) {
        sendMessage(WorkerStatus.START_FAIL, e.message);
    }
}

export * from "./schedule";
