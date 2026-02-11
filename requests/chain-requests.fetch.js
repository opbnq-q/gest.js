const BASE = "http://localhost:3000";

const cases = [
  {
    name: "valid",
    method: "GET",
    path: "/examples/middleware/chain/?sex=man",
    expectStatus: 200,
    expectJson: true,
  },
  {
    name: "missing sex",
    method: "GET",
    path: "/examples/middleware/chain/",
    expectStatus: 400,
    expectJson: true,
  },
  {
    name: "invalid sex",
    method: "GET",
    path: "/examples/middleware/chain/?sex=robot",
    expectStatus: 400,
    expectJson: true,
  },
  {
    name: "blocked by guard",
    method: "GET",
    path: "/examples/middleware/chain/?sex=man&block=1",
    expectStatus: 500,
    expectJson: false,
  },
  {
    name: "wrong method",
    method: "POST",
    path: "/examples/middleware/chain/?sex=man",
    expectStatus: 404,
    expectJson: false,
  },
];

function withTimeout(ms) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { controller, clear: () => clearTimeout(id) };
}

async function requestCase(item) {
  const { controller, clear } = withTimeout(4000);
  try {
    const res = await fetch(`${BASE}${item.path}`, {
      method: item.method,
      signal: controller.signal,
    });
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const bodyText = await res.text();
    let body = bodyText;
    if (isJson) {
      try {
        body = JSON.parse(bodyText);
      } catch {
        body = bodyText;
      }
    }
    return {
      ok: res.ok,
      status: res.status,
      contentType,
      body,
    };
  } finally {
    clear();
  }
}

async function run() {
  console.log(`Base: ${BASE}`);
  for (const item of cases) {
    try {
      const result = await requestCase(item);
      console.log("\n===", item.name);
      console.log("request:", `${item.method} ${item.path}`);
      console.log("status:", result.status);
      console.log("content-type:", result.contentType || "<none>");
      console.log("body:", result.body || "<empty>");
      const statusOk = result.status === item.expectStatus;
      const jsonOk = item.expectJson ? typeof result.body === "object" : true;
      console.log("check:", statusOk && jsonOk ? "OK" : "NOT OK");
    } catch (err) {
      const message = err && err.name === "AbortError" ? "timeout" : err?.message;
      console.log("\n===", item.name);
      console.log("request:", `${item.method} ${item.path}`);
      console.log("error:", message || err);
    }
  }
}

run();
