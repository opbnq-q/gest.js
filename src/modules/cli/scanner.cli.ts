import { join, resolve } from "path";
import { readdir, mkdir, opendir } from "fs/promises";
import { Route } from "../router/route.class.router";
import { Env } from "../env/index.env";

export class Scanner {
  private readonly env = new Env();
  private readonly ROUTES_DIR = this.env.get("ROUTES_DIR") ?? "routes";
  private readonly fullRoutersPath: string;

  constructor() {
    this.fullRoutersPath = join(".", this.ROUTES_DIR);
  }

  async makeDir() {
    try {
      await readdir(this.fullRoutersPath);
    } catch {
      await mkdir(this.fullRoutersPath);
    }
  }

  public async getRoutes(): Promise<string[]> {
    await this.makeDir();
    const files: string[] = [];
    const dirs: string[] = [this.fullRoutersPath];
    while (dirs.length) {
      const last = dirs.pop() as string;
      const dir = await opendir(last);
      for await (const item of dir) {
        if (item.isDirectory()) {
          dirs.push(resolve(dir.path, item.name));
        } else if (item.isFile() && item.name.endsWith(".route.ts")) {
          files.push(resolve(dir.path, item.name));
        }
      }
      await dir.close();
    }
    return files;
  }

  async getInstances(files: string[]) {
    const instances: Route[] = [];
    for (const fileSrc of files) {
      const { route }: { route: Route } = await import(fileSrc);
      route.path = this.transformPathToApi(fileSrc);
      instances.push(route);
    }
    return instances;
  }

  transformPathToApi(fullPath: string) {
    const removedPath = resolve("./routes");
    let apiPath = fullPath
      .replace(removedPath, "")
      .replace(/\\/g, "/")
      .replace(/\..*$/, "");

    if (apiPath.endsWith("/index")) {
      apiPath = apiPath.slice(0, -"/index".length);
    }

    const finalPath = apiPath || "/";

    if (finalPath === "/") {
      return finalPath;
    }

    return finalPath + "/";
  }

  get instances() {
    return this.getRoutes().then((files) => this.getInstances(files));
  }
}
