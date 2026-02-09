import { QueryParams } from "./query-params.class.router";
import { PathParams } from "./path-params.class.router";
import { Response } from "./response.class.router";
import type { IncomingMessage, ServerResponse } from "http";

export type Handler = (
  query: QueryParams,
  path: PathParams,
  request: IncomingMessage,
  response: ServerResponse,
) => Promise<Response> | Response;
