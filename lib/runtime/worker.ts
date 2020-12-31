/**
 * 进程的类型
 */
export enum WorkerType {
    AGENT = "AGENT",
    WORKER = "WORKER",
    MASTER = "MASTER",
}

export function isAgent() {
    return getWorkerType() === WorkerType.AGENT;
}

/**
 * 区分 进程的类型 （目前没有好的解决方案，通过env.SUMMER_WORKER_TYPE来区分）
 */
export function getWorkerType(): WorkerType {
    return process.env.SUMMER_WORKER_TYPE as WorkerType;
}

/**
 * 消息类型、主要是给 master进程使用
 */
export enum WorkerMessageType {
    START_SUCCESS, // 进程启动成功
    START_FAIL, // 进程启动失败
    WORKER_LISTEN, // 监听成功
    TO_AGENT, // 发送给agent
    TO_ALL_WORKER, // 发送给所有的worker(除了agent)
}

/**
 * 进程间通信的消息载体类型
 */
export interface WorkerMessagePayload<T = any> {
    data: T; // 消息的数据
    type: WorkerMessageType; // 消息类型， 主要是master使用，用来区分做什么
    to?: WorkerType; // 消息由谁发出
    form?: WorkerType; // 消息由谁接收
    action?: string;
}

/**
 * 进程间通信方法
 * @param data
 */
export function sendMessage(data: WorkerMessagePayload) {
    process.send(data);
}
