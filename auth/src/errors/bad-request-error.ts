import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = this.httpStatusCode || 400;

  constructor(
    public msg: string,
    public httpStatusCode?: number,
    public errCode?: string
  ) {
    super(msg);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.msg, errorCode: this.errCode }];
  }
}

/**
 * Usage:
 *
 * throw new BadRequestError(409,`User with email ${existingUser.email} already exists`);
 */
