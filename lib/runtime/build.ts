const path = require("path");
const { exec } = require("child_process");

const workDir = path.resolve(process.cwd(), "app", "**/*.ts");
const outDir = path.resolve(process.cwd(), "dist");

const tsConfig = {
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

console.log("start build...");
let params = "";
Object.keys(tsConfig).forEach(k => params += `--${k} ${tsConfig[k]} `);
exec(   `tsc ${workDir} ${params}`);
