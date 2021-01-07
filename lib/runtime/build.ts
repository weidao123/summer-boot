import {Logger} from "../util";

const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const outDir = path.resolve(process.cwd(), "dist");

export const tsConfig = {
    "target": "es5",
    "module": "commonjs",
    "outDir": outDir,
    "allowUnreachableCode": true,
    "allowUnusedLabels": false,
    "alwaysStrict": false,
    "experimentalDecorators": true,
    "sourceMap": false,
    "noImplicitAny": false,
    "removeComments": true,
    "allowJs": true,
    "emitDecoratorMetadata": true,
    "allowSyntheticDefaultImports": true,
    "listFiles": true,
};

function removeDir(p: string) {
    const dirs = fs.readdirSync(p);
    if (dirs.length === 0) {
        fs.rmdirSync(p);
    }
    for (const f of dirs) {
        const u = path.resolve(p, f);
        if (fs.statSync(u).isFile()) {
            fs.unlinkSync(u);
        } else {
            removeDir(u);
        }
    }
    if (fs.statSync(p).isDirectory()) {
        fs.rmdirSync(p);
    }
}

Logger.debug("start build...");
if (fs.existsSync(path.resolve(process.cwd(), "dist"))) {
    removeDir(path.resolve(process.cwd(), "dist"));
    Logger.debug("delete old dist dir");
}

let params = "";
Object.keys(tsConfig).forEach(k => params += `--${k} ${tsConfig[k]} `);
exec(   `tsc ${params}`, (err, stdin, stdout) => {
    if (!err) {
        Logger.debug("build success");
    } else {
        console.error(err);
    }
});
