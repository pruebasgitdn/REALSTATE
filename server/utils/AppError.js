export class AppError extends Error {
  constructor({ message, statusCode, errors, success: success = false }) {
    super(message);
    this.statusCode = statusCode;
    this.success = success;
    this.errors = errors;
    this.isOperational = true;
  }
}
