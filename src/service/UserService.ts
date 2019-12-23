import {User} from "../model/User";

export interface UserService {
    list(): User[];
}
