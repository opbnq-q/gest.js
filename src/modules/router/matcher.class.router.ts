import { MatchResult } from "./match-result.class.router";

export class Matcher {
  static match(route: string, path: string): MatchResult {
    const matchResult = new MatchResult(false);
    const baseUrl = "http://localhost";
    const routeUrl = new URL(route, baseUrl);
    const requestUrl = new URL(path, baseUrl);
    const { pathname: routePathname } = routeUrl;
    const { pathname: requestPathname, searchParams } = requestUrl;

    const routeSegments = routePathname.split("/").filter(Boolean);
    const requestSegments = requestPathname.split("/").filter(Boolean);

    if (routeSegments.length !== requestSegments.length) {
      return matchResult;
    }

    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i] as string;
      const requestSegment = requestSegments[i] as string;

      if (routeSegment.startsWith("[") && routeSegment.endsWith("]")) {
        const key = routeSegment.slice(1, -1);
        if (key) {
          const decodedSegment = decodeURIComponent(requestSegment);
          matchResult.pathParams.setParam(key, decodedSegment);
        }
        continue;
      }

      if (routeSegment !== requestSegment) {
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
