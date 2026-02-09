import { MatchResult } from "./match-result.class.router";

export class Matcher {
  static match(route: string, path: string): MatchResult {
    const matchResult = new MatchResult(false);
    const url = new URL(route);
    const { pathname, searchParams } = url;

    const splittedPath = path.split("/").filter(Boolean);
    const splittedRoute = pathname.split("/").filter(Boolean);

    if (splittedPath.length !== splittedRoute.length) {
      return matchResult;
    }

    for (let i = 0; i < splittedPath.length; i++) {
      const pathSegment = splittedPath[i];
      const routeSegment = splittedRoute[i];

      if (pathSegment.startsWith("[") && pathSegment.endsWith("]")) {
        const key = pathSegment.slice(1, -1);
        if (key) {
          matchResult.pathParams.setParam(key, routeSegment);
        }
        continue;
      }

      if (pathSegment !== routeSegment) {
        return matchResult;
      }
    }

    if (searchParams && Array.from(searchParams.keys()).length > 0) {
      for (const [key, value] of searchParams.entries()) {
        matchResult.queryParams.appendParam(key, value);
      }
    }

    matchResult.result = true;
    return matchResult;
  }
}
