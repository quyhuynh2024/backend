import { CustomError } from "./custom_error";

export  class InternalServerError extends CustomError {
  constructor(message: string) {
    super(message, 500);
  }
}
