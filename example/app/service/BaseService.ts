import {Service} from "summer-boot";

@Service()
export default class BaseService {
    public getPath(): string {
        return "base service";
    }
}
