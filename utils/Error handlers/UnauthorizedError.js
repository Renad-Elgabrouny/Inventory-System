// const BaseError = require("./BaseError");
import BaseError from "./BaseError.js";
export class UnauthorizedError extends BaseError {
  constructor(error = "Unauthorized") {
    super(error, 403);
    this.statusCode = 403;
    this.errors = [
      {
        msg: error,
      },
    ];
  }
}

// module.exports = UnauthorizedError;
