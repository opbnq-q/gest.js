import { Response } from "../src/modules/router/response.class.router";
import { Route } from "../src/modules/router/route.class.router";
import * as z from "zod";
import { IndexMiddleware } from "./middlewares/index.middleware";

export const route = new Route();

route.get(
  (query) => {
    return new Response().json({
      message: "hello world",
    });
  },
  {
    query: {
      name: z.string().nonempty(),
    },
  },
  new IndexMiddleware(),
);
