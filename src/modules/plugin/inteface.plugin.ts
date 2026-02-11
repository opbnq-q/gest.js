import { Route } from "../router/index.router";
import { MatchResult } from "../router/index.router";

export interface IPlugin {
  name: string;
  activate?(route: Route): Promise<void> | void;
  call?(matchResult: MatchResult, route: Route): Promise<void> | void;
}
