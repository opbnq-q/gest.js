import { Route } from "./route.class.router";
import type { IncomingMessage, ServerResponse } from "http";
import { HandlerContext } from "./handler.type.router";
import { Matcher } from "./matcher.class.router";
import { BodyParser } from "./body-parser.class.router";
import { Middleware } from "../middleware/index.middleware";
import { HttpException } from "../../exceptions/index.exceptions";

export class Router {
  private bodyParser = new BodyParser();

  constructor(public routes: Route[]) {}

  async call(req: IncomingMessage, res: ServerResponse) {
    req.method = req.method?.toLowerCase() || "get";
    req.url = req.url || "/";
    let handled = false;
    for (const route of this.routes) {
      const matchResult = Matcher.match(route.path, req.url);
      if (req.method in route.handlers && matchResult.result) {
        handled = true;
        const found = route.handlers[req.method as keyof typeof route.handlers];
        try {
          const ctx: HandlerContext = {
            query: matchResult.queryParams,
            path: matchResult.pathParams,
            request: req,
            response: res,
            ...(await this.bodyParser.parseBody(req)),
          };
          let response;
          if (Middleware.is(found!.middleware))
            response = await found!.middleware.call(ctx);
          else response = await found!.middleware(ctx);
          response?.write(res);
        } catch (e) {
          if (e instanceof HttpException) {
            res.statusCode = e.statusCode;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify({ error: e.message }));
            res.end();
            return;
          }
          res.statusCode = 500;
          res.setHeader("Content-Type", "text/plain");
          res.write("Internal Server Error");
          res.end();
        }
        return;
      }
    }
    if (!handled) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.write("Not Found");
      res.end();
    }
  }
}
