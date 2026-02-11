import { Middleware, HandlerContext } from "../../src/main";

export class TransformMiddleware extends Middleware {
  async call(ctx: HandlerContext) {
    const state = (ctx as { state?: Record<string, string> }).state ?? {};
    state["transform"] = "ok";
    (ctx as { state?: Record<string, string> }).state = state;
    return await super.call(ctx);
  }
}
