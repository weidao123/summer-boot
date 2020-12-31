export enum WorkerType {
    AGENT = "AGENT",
    WORKER = "WORKER",
}

export function isAgent() {
    return process.env.SUMMER_WORKER_TYPE === WorkerType.AGENT;
}

export enum WorkerMessageType {
    START_SUCCESS,
    START_FAIL,
    ERROR,
    EXIT
}

export interface WorkerMessagePayload<T = any> {
    data: T;
    type: WorkerMessageType
}

export function sendMessage(type: WorkerMessageType, data = null) {
    process.send({ data, type });
}
