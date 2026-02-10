# setup
```bun install``` \
```bun src/main.ts```
# base route
```typescript
// routes/index.route.ts (not in src)
import { Response } from "../src/modules/router/response.class.router";
import { Route } from "../src/modules/router/route.class.router";
import * as z from "zod";

export const route = new Route();

route.get(
  (query) => {
    return new Response().json({
      message: "hello world",
    }); // or new Response({ data: "hello world" })
  },
  { // optional validation. Can validate path, query, jsonBody
    query: {
      name: z.string().nonempty(),
    },
  },
);
```
