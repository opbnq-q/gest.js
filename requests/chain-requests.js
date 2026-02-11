const http = require("http");

const BASE = "http://localhost:3000";

function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(`${BASE}${path}`, { method: "GET" }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          path,
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

async function run() {
  const cases = [
    "/examples/middleware/chain/?sex=man",
    "/examples/middleware/chain/?sex=man&block=1",
    "/examples/middleware/chain/",
  ];

  for (const path of cases) {
    try {
      const result = await request(path);
      console.log("\n===", result.path);
      console.log("status:", result.statusCode);
      console.log("body:", result.body || "<empty>");
    } catch (err) {
      console.error("\n===", path);
      console.error("error:", err.message || err);
    }
  }
}

run();
