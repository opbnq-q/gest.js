import "dotenv/config";
import { Scanner } from "./modules/cli/scanner.cli";

const scanner = new Scanner();
const files = await scanner.getRoutes();
console.log(await scanner.getInstances(files));
