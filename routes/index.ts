import {
  Route,
  Server,
  type IPlugin,
  MatchResult,
} from "../src/entrypoint/exports.entrypoint";

class Plugin implements IPlugin {
  name = "Test";

  activate(route: Route) {
    console.log(route.path);
  }

  call(matchResult: MatchResult, route: Route): Promise<void> | void {
    console.log(route.path);
  }
}

Server.create([new Plugin()]).then((s) => s.listen());
