import { PathParams } from "./path-params.class.router";
import { QueryParams } from "./query-params.class.router";
import { Response } from "./response.class.router";
import { IncomingMessage, ServerResponse } from "http";

export type HandlerContext = {
  query: QueryParams;
  path: PathParams;
  body?: JSON | unknown;
  request: IncomingMessage;
  response: ServerResponse;
};

export type Handler = (ctx: HandlerContext) => Promise<Response> | Response;
