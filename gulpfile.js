const {src, dest, series, task} = require("gulp");
const uglify = require("gulp-uglify");
const ts = require("gulp-typescript");
const tsProj = ts.createProject("tsconfig.json");
const path = require("path");

function build() {
    return src(path.resolve(process.cwd(), "lib/**/*.ts"))
        .pipe(tsProj())
        .pipe(dest("./dist"))
}

task("default", build);
