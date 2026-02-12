import { Env } from "../env/index.env";
import { PortError } from "../../errors/index.errors";
import { createServer } from "http";
import { Router } from "../router/index.router";
import { Scanner } from "../cli/index.cli";
import { type IPlugin } from "../plugin/index.plugin";

export class Server {
  private static instance: Server;
  private static env = new Env();
  private server!: ReturnType<typeof createServer>;
  private router!: Router;
  private scanner = new Scanner();

  private constructor(
    public readonly port: number,
    public readonly host: string,
    public readonly protocol: "http" | "https",
    public readonly plugins: IPlugin[],
  ) {}

  static async create(plugins: IPlugin[] = []): Promise<Server> {
    if (Server.instance) {
      return Server.instance;
    }

    const port = +Server.env.safetyGet("PORT");
    if (isNaN(port) || port <= 0 || port > 65535) throw new PortError(port);
    const host = Server.env.safetyGet("HOST");
    const protocol = (Server.env.get("PROTOCOL") || "http") as "http" | "https";

    Server.instance = new Server(port, host, protocol, plugins);

    const routes = await Server.instance.scanner.instances;
    Server.instance.router = new Router(routes, plugins);

    for (const route of routes) {
      for (const plugin of plugins) {
        if (plugin.activate) {
          await plugin.activate(route);
          console.log(`Plugin ${plugin.name} applied.`);
        }
      }
    }

    Server.instance.server = createServer(
      Server.instance.router.call.bind(Server.instance.router),
    );
    return Server.instance;
  }

  async listen() {
    this.plugins.forEach((plugin) => plugin?.init?.());
    this.server.listen(this.port, this.host, () => {
      console.log(
        `Server is running at ${this.protocol}://${this.host}:${this.port}`,
      );
    });
  }
}
