# File based typescript framework (bun only now)

# setup

## important in bunfig.toml
```.toml
[install]
registry = "https://registry.npmjs.org"

[install.scopes]
"@jsr" = "https://npm.jsr.io"
```

```bash
bun install
```

## important
```.env
PORT=3000
HOST=127.0.0.1
```
## optional
```.env
ROUTES_DIR="src/routes" # "routes" by default
PROTOCOL="https" # or "http" by default
```

## index file
```typescript
import { Server } from "@gest/framework";

Server.create().then(s => s.listen())
```
# usage
## base route (in routes dir, "routes" by default)
```typescript
// routes/index.route.ts (not in src)
import { Response } from "@gest/framework";
import { Route } from "@gest/framework";
import * as z from "@gest/framework";

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

## middlewares
```typescript
// any file in your project, i defined the middleware 
// in routes/middlewares/index.middleware.ts 
// (it doesn't matter, gest scans only .route.ts files)
import { Middleware } from "@gest/framework";
import { type HandlerContext } from "@gest/framework";
import { Response } from "@gest/framework";

export class IndexMiddleware extends Middleware {
  async call(ctx: HandlerContext): Promise<Response | undefined> {
    console.log("middleware action");
    return await super.call(ctx); // next middleware/handler 
  }
}

// route
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
  new IndexMiddleware(), new AnotherMiddleware, ...
);
```
