// const BaseError = require("./BaseError");
import BaseError from "./BaseError.js";
export class ResourceAlreadyExistError extends BaseError {
  constructor(resource, query) {
    super(`The Field ${resource} with value ${query} Already Exist.`, 422);
    this.statusCode = 422;
    this.errors = [
      {
        msg: `The Field ${resource} with value ${query} Already Exist.`,
        param: resource,
        value: query,
      },
    ];
  }
}

// module.exports = ResourceAlreadyExistError;
