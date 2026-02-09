import { Route } from "./route.class.router";
import type { IncomingMessage, ServerResponse } from "http";
import { Handler } from "./handler.type.router";
import { Matcher } from "./matcher.class.router";

export class Router {
  constructor(public routes: Route[]) {}

  async parseBody(
    req: IncomingMessage,
  ): Promise<string | JSON | undefined | Buffer> {
    const method = req.method?.toLowerCase();
    const shouldReadBody = method && ["post", "patch", "put"].includes(method);
    if (!shouldReadBody) return;

    const raw = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on("data", (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      req.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      req.on("error", (err) => {
        reject(err);
      });
    });

    if (!raw.length) return;

    const contentType = (req.headers["content-type"] || "")
      .toString()
      .split(";")[0]
      .trim()
      .toLowerCase();

    const asText = () => raw.toString("utf8");

    if (contentType === "application/json" || contentType.endsWith("+json")) {
      try {
        return JSON.parse(asText());
      } catch {
        return asText();
      }
    }

    if (
      contentType.startsWith("text/") ||
      contentType === "application/x-www-form-urlencoded" ||
      contentType === "application/xml" ||
      contentType === "application/xhtml+xml"
    ) {
      return asText();
    }

    return raw;
  }

  async call(req: IncomingMessage, res: ServerResponse) {
    req.method = req.method?.toLowerCase() || "get";
    req.url = req.url || "/";
    for (const route of this.routes) {
      const matchResult = Matcher.match(route.path, req.url);
      if (req.method in route.handlers && matchResult.result) {
        const handler = route.handlers[
          req.method as keyof typeof route.handlers
        ] as Handler;
        try {
          const response = await handler({
            query: matchResult.queryParams,
            path: matchResult.pathParams,
            request: req,
            response: res,
            body: await this.parseBody(req),
          });
          response.write(res);
        } catch (e) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "text/plain");
          res.write("Internal Server Error");
          res.end();
        }
      }
    }
  }
}
