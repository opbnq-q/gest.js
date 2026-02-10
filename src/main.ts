import "dotenv/config";
import { Server } from "./modules/server/class.server";

const server = Server.create();

server.then((s) => s.listen());
