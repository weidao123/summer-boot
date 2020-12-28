import {Component} from "../../lib";

@Component()
export default class RandomInt {
    public get() {
        return Math.floor(Math.random() * 100);
    }
}
