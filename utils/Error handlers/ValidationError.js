import BaseError from "./BaseError.js";

export class ValidationError extends BaseError {
  constructor(errors) {
    super(`Validation Error`, 422);
    this.statusCode = 422;
    this.errors = errors;
  }
}


