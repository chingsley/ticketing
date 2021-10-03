import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';


// METHOD 1
export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Request validation error');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(error => {
      return { message: error.msg, field: error.param };
    });
  }
}



// // METHOD 2
// export class RequestValidationError extends CustomError {
//   errors: ValidationError[];
//   constructor(errors: ValidationError[]) {
//     super();
//     this.errors = errors;

//     // Only because we are wxtending a built in class
//     Object.setPrototypeOf(this, RequestValidationError.prototype);
//   }
// }