import { createServer } from "http";
import { PortError } from "../../errors/index.errors";
import { Scanner } from "../cli/index.cli";
import { Env } from "../env/index.env";
import { type IPlugin } from "../plugin/index.plugin";
import { Router } from "../router/index.router";

export class Server {
  private static instance: Server;
  private static readonly env: Env = new Env();

  private server!: ReturnType<typeof createServer>;
  private router!: Router;
  private readonly scanner: Scanner = new Scanner();

  private constructor(
    public readonly port: number,
    public readonly host: string,
    public readonly protocol: "http" | "https",
    public readonly plugins: IPlugin[],
  ) {}

  public static async create(plugins: IPlugin[] = []): Promise<Server> {
    if (Server.instance) {
      return Server.instance;
    }

    const config = this.getConfig();
    Server.instance = new Server(
      config.port,
      config.host,
      config.protocol,
      plugins,
    );

    await Server.instance.initialize(plugins);

    return Server.instance;
  }

  private static getConfig() {
    const port = Number(this.env.safetyGet("PORT"));
    if (isNaN(port) || port <= 0 || port > 65535) {
      throw new PortError(port);
    }

    const host = this.env.safetyGet("HOST");
    const protocol = (this.env.get("PROTOCOL") || "http") as "http" | "https";

    return { port, host, protocol };
  }

  private async initialize(plugins: IPlugin[]): Promise<void> {
    const routes = await this.scanner.instances;
    this.router = new Router(routes, plugins);

    await this.activatePlugins(routes, plugins);

    this.server = createServer(this.router.call.bind(this.router));
  }

  private async activatePlugins(
    routes: any[],
    plugins: IPlugin[],
  ): Promise<void> {
    for (const route of routes) {
      for (const plugin of plugins) {
        if (plugin.activate) {
          await plugin.activate(route);
          console.log(`Plugin ${plugin.name} applied.`);
        }
      }
    }
  }

  public async listen(): Promise<void> {
    this.plugins.forEach((plugin) => plugin?.init?.());

    this.server.listen(this.port, this.host, () => {
      console.log(
        `Server is running at ${this.protocol}://${this.host}:${this.port}`,
      );
    });
  }
}
