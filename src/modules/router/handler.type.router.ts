import { PathParams } from "./path-params.class.router";
import { QueryParams } from "./query-params.class.router";
import { Response } from "./response.class.router";
import { IncomingMessage, ServerResponse } from "http";

export type UrlEncodedBody = Record<
  string,
  string | JSON | Array<string | JSON>
>;

export type MultipartFile = {
  name: string;
  filename: string;
  contentType?: string;
  data: string;
  encoding: "base64";
  size: number;
};

export type MultipartBody = {
  fields: Record<string, string | JSON | Array<string | JSON>>;
  files: MultipartFile[];
};

export type BinaryBody = {
  contentType: string;
  data: string;
  encoding: "base64";
  size: number;
};

export type Body =
  | string
  | JSON
  | UrlEncodedBody
  | MultipartBody
  | BinaryBody
  | undefined;

export type HandlerContext = {
  query: QueryParams;
  path: PathParams;
  body: Body;
  request: IncomingMessage;
  response: ServerResponse;
};

export type Handler = (ctx: HandlerContext) => Promise<Response> | Response;
