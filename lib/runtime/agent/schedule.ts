import {Config, MetaKey} from "../..";
import Loader from "../../util/loader";
import  {RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit, Job} from "node-schedule";
import Container from "../../core/container";

const NodeSchedule = require("node-schedule");
const pwd = process.cwd();
const path = require("path");
const fs = require("fs");

type Constructor = { new(...args) }

export type ScheduleJob = Job;
export type ScheduleRule = RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string | number;

export interface ScheduleHandler {
    job: ScheduleJob;
    run(date: Date): void;
}

/**
 * 加载定时任务
 */
export function loadSchedule() {
    const dir = path.resolve(pwd, Config.getConfig().scheduleDir);
    if (!fs.existsSync(dir)) return;
    const map = Loader.load(dir);
    map.forEach((func: Constructor) => {
        if (Reflect.hasMetadata(MetaKey.SCHEDULE, func)) {
            const { rule } = Reflect.getMetadata(MetaKey.SCHEDULE, func);
            const instance = (Container.getByType(func) || new func()) as ScheduleHandler;
            if (typeof instance.run !== "function") {
                throw new Error("Schedule task must implements run method");
            }
            instance.job = NodeSchedule.scheduleJob(rule, instance.run.bind(instance));
        }
    })
}
