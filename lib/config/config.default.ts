import {Env} from "../util";

const workerDir = Env.isDevelopment ? "app" : "dist";

export default {
    "port": 8080,
    "worker": 2,
    "baseDir": workerDir,
    "log": {
        "dir": "logs",
        "name": "summer-boot-web.log",
        "level": "INFO",
        "size": "1mb"
    },
    "ssr": {
        "output": "dist",
        "template": "index.html",
        "enable": false,
    },
    "scheduleDir": `${workerDir}/schedule`,
    "configDir":  `${workerDir}/config/config.default`,
    "staticDir": "public",
    "starterHandlerFile": `${workerDir}/application`
}
