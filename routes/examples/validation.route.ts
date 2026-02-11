import { Response, Route, z } from "../../src/main";

export const route = new Route();

route.get(
  (ctx) => {
    return new Response().json({
      message: "validation ok",
      name: ctx.query.getParam("name"),
      role: ctx.query.getParam("role"),
    });
  },
  {
    query: {
      name: z.string().min(2),
      role: z.enum(["admin", "user"]).nonoptional(),
    },
  },
);

route.post(
  (ctx) => {
    return new Response().json({
      message: "body ok",
      body: ctx.body,
    });
  },
  {
    jsonBody: z.object({
      title: z.string().min(3),
      count: z.number().int().min(1),
    }),
  },
);
