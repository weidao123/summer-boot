
export class ResponseStatus {
    public static SUCCESS: number = 1000;
    public static ERROR: number = 2000;
}

export class ResParams<T = any> {
    constructor(status: ResponseStatus, data: T, message: string = "request success") {
        this.status = status;
        this.message = message;
        this.data = data;
    }
    private status: ResponseStatus;
    private message: string;
    private data: T;
}
