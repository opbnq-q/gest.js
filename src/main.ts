import "dotenv/config";
import { Scanner } from "./modules/cli/scanner.cli";
import { CMD } from "./modules/cli/index.cli";
import { Matcher } from "./modules/router/matcher.class.router";

// const scanner = new Scanner();
// const files = await scanner.getRoutes();
// console.log(await scanner.getInstances(files));

// const cli = CMD.create();
// cli.initialize();

Matcher.match("https://localhost:3030/users/123", "/users/[id]");
Matcher.match("https://localhost:3030/users/123", "/users/[id]/profile");
