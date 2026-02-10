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

export type BodyType = "json" | "urlencoded" | "multipart" | "binary" | "text";

export type BodyByType = {
  json: JSON;
  urlencoded: UrlEncodedBody;
  multipart: MultipartBody;
  binary: BinaryBody;
  text: string;
};

export type Body = BodyByType[keyof BodyByType] | undefined;

export type ParsedBody =
  | { bodyType: "json"; body: BodyByType["json"] }
  | { bodyType: "urlencoded"; body: BodyByType["urlencoded"] }
  | { bodyType: "multipart"; body: BodyByType["multipart"] }
  | { bodyType: "binary"; body: BodyByType["binary"] }
  | { bodyType: "text"; body: BodyByType["text"] }
  | { bodyType?: undefined; body?: undefined };

export type HandlerContext = {
  query: QueryParams;
  path: PathParams;
  request: IncomingMessage;
  response: ServerResponse;
} & ParsedBody;

export type Handler = (ctx: HandlerContext) => Promise<Response> | Response;
