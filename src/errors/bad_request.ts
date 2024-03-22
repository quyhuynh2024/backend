import { CustomError } from "./custom_error";

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}
