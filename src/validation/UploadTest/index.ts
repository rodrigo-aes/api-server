import { Request } from "express";
import { FileFilterCallback } from "multer";
import FileValidator from "../FileValidator"

export default class UploadTest extends FileValidator {
    protected filter(
        req: Request,
        file: Express.Multer.File,
        callback: FileFilterCallback
    ): void {
        console.log(file)
        return callback(null, true)
    }
}