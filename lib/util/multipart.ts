import {Request} from "express";
import {IncomingForm, Part} from "formidable";

const EventEmitter = require("events").EventEmitter;
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");

type MultipartOpt = { [P in keyof IncomingForm]?: IncomingForm[P] }
type MultipartCB = (f: MultipartFile, k?: string) => string;
type MultipartFiles = { [k: string]: MultipartFile }
type MultipartField = { [k: string]: any }

interface MultipartFile {
    size: number;
    filename: string;
    originName: string;
    destPath: string;
    extname: string;
    type: string | undefined;
    buffer: Buffer;
}

export default class Multipart extends EventEmitter {

    private readonly formidable: IncomingForm;
    private readonly request: Request;
    private readonly conf: MultipartOpt = {multiples: true};

    private files: MultipartFiles = {};
    public fields: MultipartField = {};

    public static async parse(req: Request, opts: MultipartOpt = {}) {
        const multipart = new Multipart(req, opts);
        await multipart.ready();
        return multipart;
    }

    protected constructor(req: Request, opts: MultipartOpt = {}) {
        super();
        Object.assign(this.conf, opts);
        this.formidable = formidable(this.conf);
        this.request = req;

        this.formidable.on("progress", (...args) => this.emit("progress", args));
        this.formidable.on("aborted", (...args) => this.emit("aborted", args));
        this.formidable.on("error", (...args) => this.emit("error", args));
        this.formidable.on("file", (k, v) => this.files[k] = v);
        this.formidable.on("field", (k, v) => this.fields[k] = v);
        this.formidable.parse(this.request);
        this.formidable.handlePart = part => this.handlePart(part);

        this.request.on("end", () => this.emit("ready"));
    }

    public hasFile(k: string) {
        return this.files[k] !== undefined;
    }

    public async ready() {
        return new Promise(r => this.request.on("end", r));
    }

    public handlePart(part: Part) {
        const files = {};
        part.on("data", (buf: Buffer) => {
            if (part.filename) {
                if (!files[part.name]) files[part.name] = [];
                files[part.name].push(buf);
            } else {
                this.fields[part.name] = buf.toString();
            }
        });

        part.on("end", () => {
            if (part.filename) {
                const buffer = Buffer.concat(files[part.name]);
                this.files[part.name] = {
                    originName: part.filename,
                    filename: part.filename,
                    destPath: "",
                    size: buffer.byteLength,
                    extname: path.extname(part.filename),
                    type: part.mime,
                    buffer: buffer,
                };
            }
        });
    }

    public async save(cb: MultipartCB) {
        return new Promise((resolve, reject) => {
            Object.keys(this.files).forEach(k => {
                const file  = this.files[k];
                const filename = cb(file);
                const destPath = path.resolve(this.conf.uploadDir, filename);
                if (!fs.existsSync(this.conf.uploadDir)) {
                    fs.mkdirSync(this.conf.uploadDir);
                }
                const stream = fs.createWriteStream(destPath);
                stream.write(file.buffer, e => e ? reject(e) : resolve());
            });
        })
    }
}
