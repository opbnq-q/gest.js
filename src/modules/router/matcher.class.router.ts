import { MatchResult } from "./match-result.class.router";

export class Matcher {
  static match(route: string, path: string): MatchResult {
    const matchResult = new MatchResult(false);
    const url = new URL(route);
    const { pathname } = url;
    const splittedPath = path.split("/").filter(Boolean);
    const splittedRoute = pathname.split("/").filter(Boolean);
    if (splittedPath.length !== splittedRoute.length) {
      return matchResult;
    }
    for (let i = 0; i < splittedPath.length; i++) {
      const pathSegment = splittedPath[i];
      const routeSegment = splittedRoute[i];
      if (pathSegment.startsWith("[") && pathSegment.endsWith("]")) {
        continue;
      }
      if (pathSegment !== routeSegment) {
        return matchResult;
      }
    }
    matchResult.result = true;
    return matchResult;
  }
}
