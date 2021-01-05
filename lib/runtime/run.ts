#!/usr/bin/env ts-node

import {Application} from "../index";
import {isAgent} from "./worker";
import {initAgent} from "./agent";
import SummerCluster from "./summer-cluster";

const cluster = require("cluster");
process.env.NODE_ENV = process.argv.slice(2)[0] === 'start' ? 'production' : 'development';
if (cluster.isMaster) {
    new SummerCluster();
} else {
    const app = new Application();
    if (!isAgent()) {
        app.listen();
    } else {
        initAgent();
    }
}
