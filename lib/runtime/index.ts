#!/usr/bin/env node

import {Config, Logger} from "..";

const path = require("path");
const {spawn} = require("cross-spawn");

const arg = process.argv.slice(2)[0];
const env = { ...process.env, NODE_ENV: Config.getConfig().env[arg] };

if (!env.NODE_ENV && arg !== "build") {
    throw new Error(`${arg} command is not defined`);
}

const command = arg === "dev" ? "ts-node" : "node";
const file = path.resolve(__dirname, arg === "build" ? "./build.js" : "./run.js");

Logger.debug(`[master] command ${command} ${file}`);
spawn(command, [file], { stdio: 'inherit', env });
