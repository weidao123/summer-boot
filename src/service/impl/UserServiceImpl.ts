import {Service} from "../../decorator";
import {User} from "../../model/User";
import {UserService} from "../UserService";

@Service("UserService")
export default class UserServiceImpl implements UserService{
    public list(): User[] {
        return [
            new User("大翠", 18),
            new User("利达胡", 26),
        ]
    }
}
