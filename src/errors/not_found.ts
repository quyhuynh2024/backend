import { CustomError } from "./custom_error";

export  class NotFoundError extends CustomError {
    constructor(message: string) {
      super(message, 404);
    }
  }