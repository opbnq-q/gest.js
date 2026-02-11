import { Middleware, Response, HandlerContext } from "../../src/main";
import { ValidationError } from "../../src/errors/index.errors";

export class ErrorCatcherMiddleware extends Middleware {
  async call(ctx: HandlerContext): Promise<Response | undefined> {
    try {
      return await super.call(ctx);
    } catch (e) {
      if (e instanceof ValidationError) {
        return new Response({ statusCode: 400 }).json({ error: e.message });
      }
      throw e;
    }
  }
}
