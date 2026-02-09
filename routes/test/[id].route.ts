import { Response } from "../../src/modules/router/response.class.router";
import { Route } from "../../src/modules/router/route.class.router";

export const route = new Route();

route.get((query, path) => {
  console.log(query.getAllParams(), path.getAllParams());
  return new Response();
});
