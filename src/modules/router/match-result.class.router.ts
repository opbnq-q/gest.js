import { PathParams } from "./path-params.class.router";
import { QueryParams } from "./query-params.class.router";

export class MatchResult {
  public readonly pathParams: PathParams;
  public readonly queryParams: QueryParams;
  public result: boolean;

  constructor(result: boolean) {
    this.pathParams = new PathParams();
    this.queryParams = new QueryParams();
    this.result = result;
  }
}
