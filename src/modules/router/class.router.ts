import { Route } from "./route.class.router";
import type { IncomingMessage, ServerResponse } from "http";
import { Handler } from "./handler.type.router";
import { Matcher } from "./matcher.class.router";

export class Router {
  constructor(public routes: Route[]) {}

  async parseBody(req: IncomingMessage): Promise<JSON | undefined> {
    const exp =
      req.method &&
      ["post", "patch", "put"].includes(req.method.toLowerCase()) &&
      req.headers["content-type"] === "application/json";
    if (!exp) return;
    const body = await new Promise<string>((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        resolve(data);
      });
      req.on("error", (err) => {
        reject(err);
      });
    });
    try {
      return JSON.parse(body);
    } catch (e) {
      return;
    }
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
