import { Response } from "../../src/modules/router/response.class.router";
import { Route } from "../../src/modules/router/route.class.router";
import * as z from "zod";

export const route = new Route();

route.get(
  ({ query, path }) => {
    console.log(query.getParam("name"));
    return new Response();
  },
  {
    query: {
      name: z.string().nonempty("Name is required").max(3),
    },
  },
);

route.post(({ body }) => {
  return new Response().json({ ...(body as JSON) });
});
