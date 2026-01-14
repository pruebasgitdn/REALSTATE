export class ResponseSucces {
  constructor(message, data, statusCode = 200, success = true) {
    this.statusCode = 200;
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
