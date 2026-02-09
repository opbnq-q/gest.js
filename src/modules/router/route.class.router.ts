import { PathIsNotSpecifiedError } from "../../errors/PathIsNotSpecified.error";

export class Route {
  private _path: string | undefined;

  constructor() {}

  post() {}

  get() {}

  delete() {}

  patch() {}

  put() {}

  set path(value: string) {
    if (!this._path) this._path = value;
  }

  get path(): string {
    if (!this.path) throw new PathIsNotSpecifiedError();
    return this._path as string;
  }
}
