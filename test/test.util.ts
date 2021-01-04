import {SummerDate} from "../lib/util";

const {describe, it, except} = require("mocha");

describe("Util", function() {
    it('should currentDate', function () {
        console.log(SummerDate.currentDate());
        console.log(SummerDate.form(new Date()));
        console.log(SummerDate.format("YYYY-MM-DD HH:mm:ss"));
        console.log(SummerDate.format("YYYY-MM-DD"));
        console.log(SummerDate.format("HH:mm:ss"));
    });
});
