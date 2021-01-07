
export class Env {
    public static production = "production";
    public static development = "development";
    public static testing = "testing";
    public static prerelease = "prerelease";

    public static get idProduction(): boolean {
        return this.production === this.env;
    }

    public static get isDevelopment(): boolean {
        return this.development === this.env;
    }

    public static get isTesting(): boolean {
        return this.testing === this.env;
    }

    public static get isPrerelease(): boolean {
        return this.prerelease === this.env;
    }

    public static get env() {
        return process.env.NODE_ENV;
    }

}
