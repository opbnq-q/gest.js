import { Response, Route, z } from "../../../src/main";
import { ErrorCatcherMiddleware } from "../../middlewares/error-catcher.middleware";
import { TransformMiddleware } from "../../middlewares/transform.middleware";
import { GuardMiddleware } from "../../middlewares/guard.middleware";

export const route = new Route();

route.get(
  (ctx) => {
    const state = (ctx as { state?: Record<string, string> }).state ?? {};
    return new Response().json({
      message: "middleware chain ok",
      sex: ctx.query.getParam("sex"),
      state,
    });
  },
  {
    query: {
      sex: z.enum(["man", "woman", "other"]).nonoptional(),
    },
  },
  new ErrorCatcherMiddleware(),
  new TransformMiddleware(),
  new GuardMiddleware(),
);
