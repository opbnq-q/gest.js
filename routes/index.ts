import {
  Route,
  Server,
  type IPlugin,
} from "../src/entrypoint/exports.entrypoint";

class Plugin implements IPlugin {
  name = "Test";

  call(route: Route) {
    console.log(route.path);
  }
}

Server.create([new Plugin()]).then((s) => s.listen());
