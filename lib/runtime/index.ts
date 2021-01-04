#!/usr/bin/env node
switch (process.argv.slice(2)[0]) {
    case "start":
        require("./run");
        break;
    case "build":
        require("./build");
        break;
    default:
        throw new Error("unknown command");
}
