const fs = require("fs");
const path = require("path");

export class LoadFileUtils {
    /**
     * 自动加载文件夹下的所有文件
     * @param rootPath
     */
    public static load(rootPath: string): Function[] {
        let method: Function[] = [];
        // 获取路径下的所有文件、文件夹
        const res: string[] = fs.readdirSync(rootPath);
        if(res.length > 0) {
            res.forEach((item: string) => {
                let fPath = path.join(rootPath, item);
                // 判断是否是文件夹
                if (fs.statSync(fPath).isDirectory()) {
                    method = [...this.load(fPath)];
                } else {
                    console.log(rootPath + "/" + item);
                    const file = require(rootPath + "/" + item.replace(".ts", ""));
                    method.push(file);
                }
            });
        }
        return method;
    }
}
