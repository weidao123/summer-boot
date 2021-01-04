export default {
    "port": 8080,
    "worker": 2,
    "baseDir": "app",
    "log": {
        "dir": "logs",
        "name": "summer-boot-web.log",
        "level": "INFO",
        "size": "1kb"
    },
    "ssr": {
        "output": "dist",
        "template": "index.html",
        "enable": false,
    },
    "scheduleDir": "app/schedule",
    "configDir": "app/config",
    "staticDir": "public",
    "starterHandlerFile": "app/application"
}
