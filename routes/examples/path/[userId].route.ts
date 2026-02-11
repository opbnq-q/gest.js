import { Response, Route, z } from "../../../src/main";

export const route = new Route();

route.get(
  (ctx) => {
    return new Response().json({
      message: "path ok",
      userId: ctx.path.getParam("userId"),
    });
  },
  {
    path: {
      userId: z.string().uuid(),
    },
  },
);
