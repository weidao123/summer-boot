
enum Env {
    production = "production",
    development = "development",
}

export function getEnv(): Env {
    return process.argv.slice(2)[0] === "start" ? Env.production : Env.development;
}
