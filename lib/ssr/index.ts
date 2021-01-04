import {Request} from "express";
import axios from "axios";
import {Config} from "..";
import Logger from "../util/logger";

const path = require("path");
const MemoryFs = require("memory-fs");
const fs = require("fs");

const dev = process.env.NODE_ENV === "development";

function getServerBundle(ServerConf, callback?) {
    const webpack = require("webpack");
    const compiler = webpack(ServerConf);
    const name = "vue-ssr-server-bundle.json";

    return new Promise(function (resolve) {
        const mf = new MemoryFs();
        compiler.outputFileSystem = mf;
        compiler.watch({},  (err, status) => {
            if (err) {
                Logger.error(err);
                return;
            }
            status = status.toJson();
            status.errors.forEach(Logger.error);
            status.warnings.forEach(Logger.warn);
            const serverBundlePath = path.join(
                ServerConf.output.path,
                name
            );
            const bundle = mf.readFileSync(serverBundlePath, "utf-8");
            resolve(JSON.parse(bundle));
            callback && callback(JSON.parse(bundle));
        });
    })
}

async function getClientBundle() {
    const {ssr, port} = Config.getConfig();
    if (!dev) {
        const output = path.resolve(process.cwd(), ssr.output, "vue-ssr-client-manifest.json");
        return require(output);
    }
    const { data } = await axios.get(`http://localhost:${port}/vue-ssr-client-manifest.json`);
    return data;
}

export async function render(req: Request, serverConf) {
    const {ssr} = Config.getConfig();
    const templatePath = path.resolve(process.cwd(), ssr.template);
    const template = fs.readFileSync(templatePath, "utf-8");
    const serverBundle = await getServerBundle(serverConf);
    const clientBundle = await getClientBundle();
    try {
        const ServerRender = require("vue-server-renderer");
        const renderer = ServerRender.createBundleRenderer(serverBundle, {
            clientManifest: clientBundle,
            template,
            runInNewContext: false,
            inject: true
        });
        return await renderer.renderToString({url: req.url});
    } catch (e) {
        return e.toString();
    }
}
