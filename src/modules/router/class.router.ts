import { Route } from "./route.class.router";
import type { IncomingMessage, ServerResponse } from "http";
import { Handler } from "./handler.type.router";
import { Matcher } from "./matcher.class.router";
import type {
  Body,
  UrlEncodedBody,
  MultipartBody,
  MultipartFile,
  BinaryBody,
} from "./handler.type.router";

export class Router {
  constructor(public routes: Route[]) {}

  private tryParseJson(text: string): JSON | undefined {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      return JSON.parse(trimmed);
    } catch {
      return;
    }
  }

  private parseUrlEncoded(text: string): UrlEncodedBody {
    const params = new URLSearchParams(text);
    const result: UrlEncodedBody = {};
    for (const [key, value] of params) {
      const parsed = this.tryParseJson(value) ?? value;
      const existing = result[key];
      if (existing === undefined) {
        result[key] = parsed;
      } else if (Array.isArray(existing)) {
        existing.push(parsed as JSON | string);
      } else {
        result[key] = [existing as JSON | string, parsed];
      }
    }
    return result;
  }

  private parseMultipart(raw: Buffer, boundary: string): MultipartBody {
    const fields: MultipartBody["fields"] = {};
    const files: MultipartFile[] = [];
    const boundaryBuffer = Buffer.from(`--${boundary}`);
    let pos = raw.indexOf(boundaryBuffer);
    if (pos === -1) return { fields, files };

    while (pos !== -1) {
      pos += boundaryBuffer.length;
      if (raw.slice(pos, pos + 2).toString() === "--") break;
      if (raw.slice(pos, pos + 2).toString() === "\r\n") pos += 2;

      const next = raw.indexOf(boundaryBuffer, pos);
      if (next === -1) break;

      const part = raw.slice(pos, next - 2);
      const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
      if (headerEnd === -1) {
        pos = next;
        continue;
      }

      const headerText = part.slice(0, headerEnd).toString("utf8");
      const body = part.slice(headerEnd + 4);
      const headers: Record<string, string> = {};
      for (const line of headerText.split("\r\n")) {
        const idx = line.indexOf(":");
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim().toLowerCase();
        const value = line.slice(idx + 1).trim();
        headers[key] = value;
      }

      const disposition = headers["content-disposition"] || "";
      const nameMatch = /name="([^"]*)"/.exec(disposition);
      const filenameMatch = /filename="([^"]*)"/.exec(disposition);
      const name = nameMatch?.[1] ?? "";

      if (filenameMatch) {
        files.push({
          name,
          filename: filenameMatch[1],
          contentType: headers["content-type"],
          data: body.toString("base64"),
          encoding: "base64",
          size: body.length,
        });
      } else if (name) {
        const text = body.toString("utf8");
        const parsed = this.tryParseJson(text) ?? text;
        const existing = fields[name];
        if (existing === undefined) {
          fields[name] = parsed;
        } else if (Array.isArray(existing)) {
          existing.push(parsed as JSON | string);
        } else {
          fields[name] = [existing as JSON | string, parsed];
        }
      }

      pos = next;
    }

    return { fields, files };
  }

  private toBinaryBody(raw: Buffer, contentType: string): BinaryBody {
    return {
      contentType: contentType || "application/octet-stream",
      data: raw.toString("base64"),
      encoding: "base64",
      size: raw.length,
    };
  }

  async parseBody(req: IncomingMessage): Promise<Body> {
    const method = req.method?.toLowerCase();
    const shouldReadBody = method && ["post", "patch", "put"].includes(method);
    if (!shouldReadBody) return;

    const raw = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on("data", (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      req.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      req.on("error", (err) => {
        reject(err);
      });
    });

    if (!raw.length) return;

    const contentTypeHeader = (req.headers["content-type"] || "").toString();
    const [mediaType, ...params] = contentTypeHeader
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean);

    const getParam = (name: string) => {
      const found = params.find((param) =>
        param.toLowerCase().startsWith(`${name}=`),
      );
      if (!found) return;
      return found.slice(name.length + 1).replace(/^"|"$/g, "");
    };

    const text = raw.toString("utf8");

    if (mediaType === "multipart/form-data") {
      const boundary = getParam("boundary");
      if (!boundary) return this.toBinaryBody(raw, mediaType);
      return this.parseMultipart(raw, boundary);
    }

    if (mediaType === "application/x-www-form-urlencoded") {
      return this.parseUrlEncoded(text);
    }

    if (mediaType === "application/json" || mediaType?.endsWith("+json")) {
      return this.tryParseJson(text) ?? text;
    }

    if (
      !mediaType ||
      mediaType.startsWith("text/") ||
      mediaType === "application/xml" ||
      mediaType === "application/xhtml+xml"
    ) {
      return this.tryParseJson(text) ?? text;
    }

    return this.tryParseJson(text) ?? this.toBinaryBody(raw, mediaType);
  }

  async call(req: IncomingMessage, res: ServerResponse) {
    req.method = req.method?.toLowerCase() || "get";
    req.url = req.url || "/";
    for (const route of this.routes) {
      const matchResult = Matcher.match(route.path, req.url);
      if (req.method in route.handlers && matchResult.result) {
        const handler = route.handlers[
          req.method as keyof typeof route.handlers
        ] as Handler;
        try {
          const response = await handler({
            query: matchResult.queryParams,
            path: matchResult.pathParams,
            request: req,
            response: res,
            body: await this.parseBody(req),
          });
          response.write(res);
        } catch (e) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "text/plain");
          res.write("Internal Server Error");
          res.end();
        }
      }
    }
  }
}
