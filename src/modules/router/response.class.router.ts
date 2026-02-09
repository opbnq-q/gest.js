import { ServerResponse } from "http";

export class Response {
  body?: string | Buffer;
  headers: Record<string, string> = {};
  statusCode: number = 200;
  constructor(options?: {
    statusCode?: number;
    headers?: Record<string, string>;
  }) {
    if (options) {
      if (options.statusCode) this.statusCode = options.statusCode;
      if (options.headers) this.headers = options.headers;
    }
  }

  json(data: object) {
    this.headers["Content-Type"] = "application/json";
    this.body = JSON.stringify(data);
  }

  write(res: ServerResponse) {
    res.statusCode = this.statusCode;
    for (const [key, value] of Object.entries(this.headers)) {
      res.setHeader(key, value);
    }
    if (this.body) {
      res.write(this.body);
    }
    res.end();
  }
}
