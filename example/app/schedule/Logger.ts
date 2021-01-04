import {Autowrite, Schedule, ScheduleHandler, ScheduleJob, sendMessage, WorkerMessageType} from "summer-boot";
import BaseService from "../service/BaseService";

@Schedule("30 * * * * *")
export default class LoggerSchedule implements ScheduleHandler{

    @Autowrite()
    private base:BaseService;

    public job: ScheduleJob;

    public run(date: Date): void {
        console.log("定时任务被执行--->pid=" + process.pid);
    }
}
