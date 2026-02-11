import { Response, Route, z } from "../src/entrypoint/exports.entrypoint";

export const route = new Route();

route.get(() => new Response(), { path: { name: z.string().nonempty() } });
