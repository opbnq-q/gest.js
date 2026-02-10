# File based typescript framework (bun only now)

# setup
```bunfig.toml
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

# base route (in routes dir, "routes" by default)
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
