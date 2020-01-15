import { Request as HttpRequest, Response as HttpResponse } from 'express';

export type RequestType = "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "OPTIONS";
export {
    HttpRequest, HttpResponse,
}
