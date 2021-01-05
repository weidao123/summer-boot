const {spawn} = require("child_process");
const commandConvert = require("cross-env/src/command");
const commandArgs = ["./test01.ts"];
const env = {
    ...process.env,
    NODE_ENV: "TEST_ENV"
};

// spawn(
//     // run `path.normalize` for command(on windows)
//     commandConvert("ts-node", env, true),
//     // by default normalize is `false`, so not run for cmd args
//     commandArgs.map(arg => commandConvert(arg, env)),
//     {
//         stdio: 'inherit',
//         env: env,
//     },
// );

spawn(
    // run `path.normalize` for command(on windows)
    "ts-node",
    // by default normalize is `false`, so not run for cmd args
    commandArgs,
    {
        stdio: 'inherit',
        env: env,
    },
);
