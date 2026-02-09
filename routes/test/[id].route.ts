import { Response } from "../../src/modules/router/response.class.router";
import { Route } from "../../src/modules/router/route.class.router";

export const route = new Route();

route.get(({ query, path }) => {
  return new Response();
});

route.post(({ body }) => {
  console.log(body);
  return new Response().json(body as {});
});
