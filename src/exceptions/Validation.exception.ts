import { HttpException } from "./HttpException.exception";

export class ValidationException extends HttpException {
  type: "path" | "query" | "body";

  constructor(type: "path" | "query" | "body", message: string) {
    super(400, `${type} validation error: ${message}`);
    this.type = type;
  }
}
