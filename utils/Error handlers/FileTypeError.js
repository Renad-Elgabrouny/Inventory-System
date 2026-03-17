import BaseError from "./BaseError.js";
export class FileTypeError extends BaseError {
  constructor(trace) {
    console.log(trace);
    const error = { msg: "Incorrect File type" };
    super(error.msg, 422);
    this.statusCode = 422;
    this.errors = [error];
  }
}
