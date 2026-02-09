import { MethodIsAlreadyDefined } from "../../errors/MethodIsAlreadyDefined.error";
import { PathIsNotSpecifiedError } from "../../errors/PathIsNotSpecified.error";
import { Handler } from "./handler.type.router";
import { Method } from "./method.type.router";

export class Route {
  private _path: string | undefined;
  public handlers: Partial<Record<Method, Handler>> = {};

  constructor() {}

  validate(method: Method) {
    if (method in this.handlers) throw new MethodIsAlreadyDefined(method);
  }

  post(handler: Handler) {
    this.validate("post");
    this.handlers.post = handler;
  }

  get(handler: Handler) {
    this.validate("get");
    this.handlers.get = handler;
  }

  delete(handler: Handler) {
    this.validate("delete");
    this.handlers.delete = handler;
  }

  patch(handler: Handler) {
    this.handlers.patch = handler;
  }

  put(handler: Handler) {
    this.handlers.put = handler;
  }

  set path(value: string) {
    if (!this._path) this._path = value;
  }

  get path(): string {
    if (!this._path) throw new PathIsNotSpecifiedError();
    return this._path as string;
  }
}
