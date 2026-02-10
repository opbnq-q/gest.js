import { MethodIsAlreadyDefined } from "../../errors/MethodIsAlreadyDefined.error";
import { PathIsNotSpecifiedError } from "../../errors/PathIsNotSpecified.error";
import { Middleware, Next } from "../middleware/index.middleware";
import { Handler } from "./handler.type.router";
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

  validate(method: Method) {
    if (method in this.handlers) throw new MethodIsAlreadyDefined(method);
  }

  get(
    handler: Handler,
    validationSchema?: ValidationSchema,
    ...middlewares: Middleware[]
  ) {
    this.validate("get");
    this.handlers.get = {
      handler,
      validationSchema,
      middleware: Middleware.from(middlewares, handler),
    };
  }

  post(
    handler: Handler,
    validationSchema?: ValidationSchema,
    ...middlewares: Middleware[]
  ) {
    this.validate("post");
    this.handlers.post = {
      handler,
      validationSchema,
      middleware: Middleware.from(middlewares, handler),
    };
  }

  delete(
    handler: Handler,
    validationSchema?: ValidationSchema,
    ...middlewares: Middleware[]
  ) {
    this.validate("delete");
    this.handlers.delete = {
      handler,
      validationSchema,
      middleware: Middleware.from(middlewares, handler),
    };
  }

  patch(
    handler: Handler,
    validationSchema?: ValidationSchema,
    ...middlewares: Middleware[]
  ) {
    this.handlers.patch = {
      handler,
      validationSchema,
      middleware: Middleware.from(middlewares, handler),
    };
  }

  put(
    handler: Handler,
    validationSchema?: ValidationSchema,
    ...middlewares: Middleware[]
  ) {
    this.handlers.put = {
      middleware: Middleware.from(middlewares, handler),
      handler,
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
