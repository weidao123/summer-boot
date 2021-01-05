const fs = require("fs");
const path = require("path");

function removeDir(p) {
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

removeDir(path.resolve(__dirname, "./dist"));
