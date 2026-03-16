// const BaseError = require("./BaseError");
import BaseError from "./BaseError.js";
export class RouteNotFoundError extends BaseError {
  constructor(error) {
    super(error, 404);
    this.statusCode = 404;
    this.errors = [
      {
        msg: error,
      },
    ];
  }
}

// module.exports = RouteNotFoundError;
