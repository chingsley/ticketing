class RequestValidationError extends Error {
  constructor(errors) {
    super(JSON.stringify(errors));
    this.errors = errors;
  }

  serializeErrors() {
    return this.errors.map(({ msg: message, param: field }) => ({
      message,
      field,
    }));
  }
}

class DatabaseConnectionError extends Error {
  // reason = 'Error connecting to database';

  constructor() {
    super();
    this.reason = 'Error connecting to database';

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

let error = null;

try {
  throw new RequestValidationError([
    { msg: 'error1', param: 'param1' },
    { msg: 'error2', param: 'param2' },
  ]);
} catch (err) {
  error = err;
  // console.log(err);
  // console.log(typeof err);

  // console.log(err instanceof RequestValidationError);
  // console.log(err.message);
  // console.log(err.errors);
  // console.log(err.reason);
}
