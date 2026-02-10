import { MethodIsAlreadyDefined } from "../../errors/MethodIsAlreadyDefined.error";
import { PathIsNotSpecifiedError } from "../../errors/PathIsNotSpecified.error";
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
      }
    >
  > = {};

  constructor() {}

  validate(method: Method) {
    if (method in this.handlers) throw new MethodIsAlreadyDefined(method);
  }

  post(handler: Handler, validationSchema?: ValidationSchema) {
    this.validate("post");
    this.handlers.post = {
      handler,
      validationSchema,
    };
  }

  get(handler: Handler, validationSchema?: ValidationSchema) {
    this.validate("get");
    this.handlers.get = { handler, validationSchema };
  }

  delete(handler: Handler, validationSchema?: ValidationSchema) {
    this.validate("delete");
    this.handlers.delete = { handler, validationSchema };
  }

  patch(handler: Handler, validationSchema?: ValidationSchema) {
    this.handlers.patch = { handler, validationSchema };
  }

  put(handler: Handler, validationSchema?: ValidationSchema) {
    this.handlers.put = { handler, validationSchema };
  }

  set path(value: string) {
    if (!this._path) this._path = value;
  }

  get path(): string {
    if (!this._path) throw new PathIsNotSpecifiedError();
    return this._path as string;
  }
}
