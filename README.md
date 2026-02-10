# setup
```bash
bun install
```

```bash
bun src/main.ts
```
## important
```.env
PORT=3000
HOST=127.0.0.1
```
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
