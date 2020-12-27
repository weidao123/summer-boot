import {Service} from "../../lib";

@Service()
export default class BaseService {
    public getPath(): string {
        return "base service";
    }
}
