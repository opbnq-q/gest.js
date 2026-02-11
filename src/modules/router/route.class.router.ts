import {
  MethodIsAlreadyDefined,
  PathIsNotSpecifiedError,
  ValidationError,
} from "../../errors/index.errors";
import { Middleware, Next } from "../middleware/index.middleware";
import { Handler, HandlerContext } from "./handler.type.router";
import { Method } from "./method.type.router";
import * as z from "zod";

export type ValidationSchema = {
  path?: {
    [key in string]: z.ZodType;
  };
  query?: {
    [key in string]: z.ZodType;
  };
  jsonBody?: z.ZodType;
};

export class Route {
  private _path: string | undefined;
  public handlers: Partial<
    Record<
      Method,
      {
        handler: Handler;
        validationSchema?: ValidationSchema;
        middleware: Next;
      }
    >
  > = {};

  constructor() {}

  private wrapHandler(
    handler: Handler,
    validationSchema?: ValidationSchema,
  ): Handler {
    if (!validationSchema) return handler;
    return async (ctx) => {
      await Route.validate(ctx, validationSchema);
      return await handler(ctx);
    };
  }

  static async validate(
    ctx: HandlerContext,
    validationSchema?: ValidationSchema,
  ) {
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

  validate(method: Method) {
    if (method in this.handlers) throw new MethodIsAlreadyDefined(method);
  }

  get(
    handler: Handler,
    validationSchema?: ValidationSchema,
    ...middlewares: Middleware[]
  ) {
    this.validate("get");
    const wrappedHandler = this.wrapHandler(handler, validationSchema);
    this.handlers.get = {
      handler: wrappedHandler,
      validationSchema,
      middleware: Middleware.from(middlewares, wrappedHandler),
    };
  }

  post(
    handler: Handler,
    validationSchema?: ValidationSchema,
    ...middlewares: Middleware[]
  ) {
    this.validate("post");
    const wrappedHandler = this.wrapHandler(handler, validationSchema);
    this.handlers.post = {
      handler: wrappedHandler,
      validationSchema,
      middleware: Middleware.from(middlewares, wrappedHandler),
    };
  }

  delete(
    handler: Handler,
    validationSchema?: ValidationSchema,
    ...middlewares: Middleware[]
  ) {
    this.validate("delete");
    const wrappedHandler = this.wrapHandler(handler, validationSchema);
    this.handlers.delete = {
      handler: wrappedHandler,
      validationSchema,
      middleware: Middleware.from(middlewares, wrappedHandler),
    };
  }

  patch(
    handler: Handler,
    validationSchema?: ValidationSchema,
    ...middlewares: Middleware[]
  ) {
    const wrappedHandler = this.wrapHandler(handler, validationSchema);
    this.handlers.patch = {
      handler: wrappedHandler,
      validationSchema,
      middleware: Middleware.from(middlewares, wrappedHandler),
    };
  }

  put(
    handler: Handler,
    validationSchema?: ValidationSchema,
    ...middlewares: Middleware[]
  ) {
    const wrappedHandler = this.wrapHandler(handler, validationSchema);
    this.handlers.put = {
      middleware: Middleware.from(middlewares, wrappedHandler),
      handler: wrappedHandler,
      validationSchema,
    };
  }

  set path(value: string) {
    if (!this._path) this._path = value;
  }

  get path(): string {
    if (!this._path) throw new PathIsNotSpecifiedError();
    return this._path as string;
  }
}
