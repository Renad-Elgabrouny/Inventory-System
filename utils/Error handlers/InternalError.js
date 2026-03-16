// const BaseError = require("./BaseError");

import BaseError from "./BaseError.js";
export class InternalError extends BaseError {
  constructor(trace) {
    console.log(trace);
    const error = { msg: "Something went wrong" };
    super(error.msg, 500);
    this.statusCode = 500;
    this.errors = [error];
  }
}

// module.exports = InternalError;
