import { Route } from "../router/index.router";

export interface IPlugin {
  name: string;
  call(route: Route): Promise<void> | void;
}
