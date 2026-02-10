import { HandlerContext } from "../router/handler.type.router";
import { Handler } from "../router/index.router";

export class Middleware {
  constructor(
    public handler: Handler,
    public next?: Middleware | Handler,
  ) {}

  async call(ctx: HandlerContext) {
    await this.handler(ctx);
    if (typeof this.next === "undefined") return;
    if (this.next instanceof Middleware) {
      await this.next.call(ctx);
      return;
    }
    await this.next(ctx);
  }
}
