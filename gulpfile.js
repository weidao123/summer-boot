const {src, dest, series, task} = require("gulp");
const uglify = require("gulp-uglify");
const ts = require("gulp-typescript");
const path = require("path");
const clean = require("gulp-clean");

const pro = ts.createProject("tsconfig.json", { module: "commonjs" });

task("clear", function () {
    return src(path.resolve(process.cwd(), "dist/*"), {read: false, allowEmpty: true})
        .pipe(clean());
});

task("build", function () {
    return src(path.resolve(process.cwd(), "lib/**/*.ts"))
        .pipe(pro())
        .pipe(dest("./dist"))
});

task("uglifyJS", function () {
    return src(path.resolve(process.cwd(), "dist/**/*.js"))
        .pipe(uglify())
        .pipe(dest("./dist"))
});

task("default", series("clear", "build", "uglifyJS"));
