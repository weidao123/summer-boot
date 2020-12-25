import Logger from "../util/logger";
import {Application} from "../index";
import {isAgent, WorkerType} from "./worker-type";

const cluster = require("cluster");
const os = require("os");
const net = require("net");

/**
 * App启动程序
 */
function bootstrap() {
    const app = new Application();
    app.listen();
}
bootstrap();
// if (cluster.isMaster) {
//     const worker = cluster.fork({ NODE_WORK_TYPE: WorkerType.AGENT });
//     worker.on("message", function (msg) {
//         const count = os.cpus().length;
//         for (let i = 0; i < count; i++) {
//             cluster.fork();
//         }
//         cluster.on("exit", (worker, code, signal) => {
//             Logger.error(`Worker pid=${worker.process.pid} exit, code ${code}, signal ${signal}`);
//             cluster.fork({ NODE_WORK_TYPE: WorkerType.WORKER });
//         })
//     })
// } else {
//     Logger.info(`Worker ${process.pid} started`);
//     bootstrap();
// }
//
// if (isAgent()) {
//     process.send("hello master");
// }
