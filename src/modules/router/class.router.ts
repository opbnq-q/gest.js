import { Route, ValidationSchema } from "./route.class.router";
import type { IncomingMessage, ServerResponse } from "http";
import { HandlerContext } from "./handler.type.router";
import { Matcher } from "./matcher.class.router";
import { BodyParser } from "./body-parser.class.router";
import { ValidationError } from "../../errors/index.errors";
import * as z from "zod";
import { Middleware } from "../middleware/index.middleware";

export class Router {
  private bodyParser = new BodyParser();

  constructor(public routes: Route[]) {}

  async validate(ctx: HandlerContext, validationSchema?: ValidationSchema) {
    if (!validationSchema) return;
    if (validationSchema.path) {
      for (const [key, schema] of Object.entries(validationSchema.path)) {
        const value = ctx.path.getParam(key);
        try {
          schema.parse(value);
        } catch (e) {
          if (e instanceof z.ZodError) {
            throw new ValidationError(
              "path",
              e.issues.map((err) => err.message).join(", "),
            );
          }
        }
      }
    }
    if (validationSchema.query) {
      for (const [key, schema] of Object.entries(validationSchema.query)) {
        const value = ctx.query.getParam(key);
        try {
          schema.parse(value);
        } catch (e) {
          if (e instanceof z.ZodError) {
            throw new ValidationError(
              "query",
              e.issues.map((err) => err.message).join(", "),
            );
          }
        }
      }
    }
    if (validationSchema.jsonBody) {
      if (ctx.bodyType !== "json") {
        throw new ValidationError("body", "Expected JSON body");
      }
      const schema = validationSchema.jsonBody;
      try {
        schema.parse(ctx.body);
      } catch (e) {
        if (e instanceof z.ZodError) {
          throw new ValidationError(
            "body",
            e.issues.map((err) => err.message).join(", "),
          );
        }
      }
    }
  }

  async call(req: IncomingMessage, res: ServerResponse) {
    req.method = req.method?.toLowerCase() || "get";
    req.url = req.url || "/";
    for (const route of this.routes) {
      const matchResult = Matcher.match(route.path, req.url);
      if (req.method in route.handlers && matchResult.result) {
        const found = route.handlers[req.method as keyof typeof route.handlers];
        try {
          const ctx: HandlerContext = {
            query: matchResult.queryParams,
            path: matchResult.pathParams,
            request: req,
            response: res,
            ...(await this.bodyParser.parseBody(req)),
          };
          await this.validate(ctx, found!.validationSchema);
          let response;
          if (Middleware.is(found!.middleware))
            response = await found!.middleware.call(ctx);
          else response = await found!.middleware(ctx);
          response?.write(res);
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
