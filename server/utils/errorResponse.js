class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Ensure the stack trace is captured properly
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorResponse;
