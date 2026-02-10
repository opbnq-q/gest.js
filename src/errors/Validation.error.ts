export class ValidationError extends Error {
  constructor(type: "path" | "query" | "body", message: string) {
    super(`${type} validation error: ${message}`);
    this.name = "ValidationError";
  }
}
