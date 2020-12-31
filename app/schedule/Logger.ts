import {Autowrite, Schedule, ScheduleHandler, ScheduleJob, sendMessage, WorkerMessageType} from "../../lib";
import BaseService from "../service/BaseService";

@Schedule("30 * * * * *")
export default class LoggerSchedule implements ScheduleHandler{

    @Autowrite()
    private base:BaseService;

    public job: ScheduleJob;

    public run(date: Date): void {
        // 发送给app worker
        // sendMessage({
        //     type: WorkerMessageType.TO_ALL_WORKER,
        //     data: {
        //         id: process.pid,
        //         msg: '来自agent'
        //     },
        // });
        // console.log("定时任务被执行--->pid=" + process.pid);
    }
}
