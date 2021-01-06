#!/usr/bin/env node

import {Env} from "../util";

const path = require("path");
const {spawn} = require("cross-spawn");
const env = { ...process.env };

let file;
let command = "node";
switch (process.argv.slice(2)[0]) {
    case "dev":
        command = "ts-node";
        file = path.resolve(__dirname, './run.js');
        env.NODE_ENV = Env.development;
        break;
    case "start":
        file = path.resolve(__dirname, './run.js');
        env.NODE_ENV = Env.production;
        break;
    case "build":
        file = path.resolve(__dirname, './build.js');
        break;
    default:
        throw new Error("unknown command");
}

spawn(command, [file], { stdio: 'inherit', env: env });
export {}
