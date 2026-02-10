import { Middleware } from "../../src/modules/middleware/class.middleware";
import { HandlerContext } from "../../src/modules/router/handler.type.router";
import { Response } from "../../src/modules/router/response.class.router";

export class IndexMiddleware extends Middleware {
  async call(ctx: HandlerContext): Promise<Response | undefined> {
    console.log("middleware");
    return await super.call(ctx);
  }
}
