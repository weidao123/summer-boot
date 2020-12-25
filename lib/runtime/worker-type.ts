export enum WorkerType {
    AGENT = "AGENT",
    WORKER = "WORKER",
}

export function isAgent() {
    return process.env.NODE_WORK_TYPE === WorkerType.AGENT;
}
