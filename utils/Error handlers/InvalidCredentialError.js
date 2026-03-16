// const BaseError = require("./BaseError");

import BaseError from "./BaseError.js";
export class InvalidCredentialError extends BaseError {
  constructor(error = { msg: "Invalid Credential" }) {
    super(error.msg, 400);
    this.statusCode = 400;
    this.errors = [error];
  }
}

// module.exports = InvalidCredentialError;
