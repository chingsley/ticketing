import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = this.httpStatusCode || 400;

  constructor(public httpStatusCode: number, public msg: string) {
    super(msg);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.msg }];
  }
}
