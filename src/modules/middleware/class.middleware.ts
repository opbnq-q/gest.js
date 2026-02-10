import { type HandlerContext } from "../router/index.router";
import { Handler, Response } from "../router/index.router";

export type Next = Middleware | Handler;

export class Middleware {
  private next?: Next;

  async call(ctx: HandlerContext): Promise<Response | undefined> {
    if (this.next) {
      if (Middleware.is(this.next)) return await this.next.call(ctx);
      return await this.next(ctx);
    }
  }

  link(next: Next) {
    this.next = next;
  }

  static from(middlewares: Middleware[], handler: Handler): Next {
    if (!middlewares.length) return handler;
    const first = middlewares[0] as Middleware;
    let past: Middleware = first;
    for (let i = 1; i < middlewares.length; i++) {
      past.link(middlewares[i] as Middleware);
      past = middlewares[i] as Middleware;
    }
    first.link(handler);
    return first;
  }

  static is(value: unknown) {
    return value instanceof Middleware;
  }
}
