import {Service} from "../decorator";

@Service("UserService")
class UserService {
    public name: string = "test name";
}
