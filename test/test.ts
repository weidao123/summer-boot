const {spawn} = require("child_process");

const { describe } = require("mocha");

describe("Test", function() {
    it('should Test', function () {
        console.log(process.env.NODE_ENV);
    });
});
