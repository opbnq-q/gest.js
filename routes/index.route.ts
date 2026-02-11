import { Response, Route, z } from "../src/main";

export const route = new Route();

route.get(() => new Response(), { path: { name: z.string().nonempty() } });
