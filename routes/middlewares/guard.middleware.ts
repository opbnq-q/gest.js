import { Middleware, HandlerContext } from "../../src/main";

export class GuardMiddleware extends Middleware {
  async call(ctx: HandlerContext) {
    const block = ctx.query.getParam("block");
    if (block === "1") {
      throw new Error("Blocked by guard middleware");
    }
    return await super.call(ctx);
  }
}
