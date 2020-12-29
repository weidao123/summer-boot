#!/usr/bin/env ts-node

import Logger from "../util/logger";
import {Application, Config} from "../index";
import {isAgent, Worker, WorkerMessage, WorkerStatus} from "./worker";
import {initAgent} from "./agent";

const cluster = require("cluster");
/**
 * App启动程序
 */
function bootstrap() {
    const app = new Application();
    if (!isAgent()) {
        app.listen();
    }
}

if (cluster.isMaster) {
    const conf = Config.getConfig();
    const agent = cluster.fork({ NODE_WORK_TYPE: Worker.AGENT });
    const workers = [];
    let successCount = 0;

    agent.once("message", function (msg: WorkerMessage) {
        if (msg.type === WorkerStatus.START_FAIL) {
            Logger.error("Agent start fail");
            Logger.error(msg.data);
            process.exit(1);
        }
    });
    agent.once("message", function (msg: WorkerMessage) {
        if (msg.type === WorkerStatus.AGENT_START_SUCCESS) {
            Logger.info(`Agent start pid ${agent.process.pid}`);
            for (let i = 0; i < conf.worker; i++) {
                const worker = cluster.fork();
                workers.push(worker);
                worker.once("message", function (data: WorkerMessage) {
                    if (data.type === WorkerStatus.START_SUCCESS) {
                        successCount++;
                        if (successCount === conf.worker) {
                            const pids = workers.map((item) => item.process.pid);
                            Logger.info(`Workers: [${pids}]`);
                            Logger.info(`Master: [${process.pid}]`);
                            Logger.info("Application running hare http://127.0.0.1:" + conf.port);
                        }
                    }
                });
            }
        }
    });
    cluster.on("exit", (worker, code, signal) => {
        if (successCount === conf.worker) {
            Logger.error(`Worker pid=${worker.process.pid} exit, code ${code}, signal ${signal}`);
            const w = cluster.fork({ NODE_WORK_TYPE: Worker.WORKER });
            Logger.info("fork worker pid " + w.process.pid);
        } else {
            Logger.error(`Application run fail`);
        }
    });
} else {
    bootstrap();
}

if (isAgent()) {
    initAgent();
}
