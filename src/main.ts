import "dotenv/config";
import { Server } from "./modules/server/class.server";

const server = await Server.create();

server.listen();
