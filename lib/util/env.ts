
export enum Env {
    production = "production",
    development = "development",
}

export function getEnv(): Env {
    return process.env.NODE_ENV as Env;
}
