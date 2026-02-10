export class PathIsNotSpecifiedError extends Error {
  constructor() {
    super("Path is not specified error");
    this.name = "PathIsNotSpecifiedError";
  }
}
