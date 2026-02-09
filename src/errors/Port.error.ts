export class PortError extends Error {
  constructor(port: number) {
    super(
      `Invalid port number: ${port}. Port must be a number between 1 and 65535.`,
    );
    this.name = "PortError";
  }
}
