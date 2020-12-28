import Application from "./core/application";
import Logger from "./util/logger";

export * from "./core/decorate";
export * from "./config/config";

export { render } from "./ssr";

export {
    Logger,
    Application,
}

export default Application;
