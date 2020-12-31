import {sendMessage, WorkerMessageType} from "../worker";
import {loadSchedule} from "./schedule";
import Logger from "../../util/logger";

export function initAgent() {
    try {
        loadSchedule();
        sendMessage(WorkerMessageType.START_SUCCESS);
    } catch (e) {
        sendMessage(WorkerMessageType.START_FAIL, e.message);
    }
}

export * from "./schedule";
