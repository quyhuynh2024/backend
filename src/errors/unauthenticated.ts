import { CustomError } from "./custom_error";

export class UnAuthenticatedError extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}
