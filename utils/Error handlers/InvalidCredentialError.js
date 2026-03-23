// const BaseError = require("./BaseError");

import BaseError from "./BaseError.js";

export class InvalidCredentialError extends BaseError {
  constructor(message = "Invalid email or password") {
    super(message, 400);

    this.statusCode = 400;

    this.errors = [
      {
        msg: message,
        param: "general",
      },
    ];
  }
}

// module.exports = InvalidCredentialError;
