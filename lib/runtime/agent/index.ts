import {sendMessage, WorkerStatus} from "../worker";
import {loadSchedule} from "./schedule";
import Logger from "../../util/logger";

export function initAgent() {
    try {
        loadSchedule();
        sendMessage(WorkerStatus.AGENT_START_SUCCESS);
        Logger.info(`Agent start pid ${process.pid}`);
    } catch (e) {
        Logger.error("Agent start fail " + e.message);
        sendMessage(WorkerStatus.START_FAIL, e.message);
    }
}

export * from "./schedule";
