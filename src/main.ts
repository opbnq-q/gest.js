import "dotenv/config";
import { Scanner } from "./modules/cli/scanner.cli";
import { CMD } from "./modules/cli/index.cli";

// const scanner = new Scanner();
// const files = await scanner.getRoutes();
// console.log(await scanner.getInstances(files));

const cli = CMD.create();
cli.initialize();
