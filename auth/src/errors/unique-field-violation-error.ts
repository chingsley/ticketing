import { CustomError } from './custom-error';

export class UniqueFieldViolationError extends CustomError {
  statusCode = 409;

  constructor(public field: string, public msg: string) {
    super(`UniqueFieldViolationError: ${msg}`);

    Object.setPrototypeOf(this, UniqueFieldViolationError.prototype);
  }

  serializeErrors() {
    return [{ message: this.msg, field: this.field }];
  }
}
