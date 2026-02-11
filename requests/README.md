# Requests

Minimal fetch runner for middleware chain edge cases.

## Run

```bat
node requests\chain-requests.fetch.js
```

## Cases

- valid: expects 200 JSON and `state.transform` present
- missing sex: expects 400 JSON from validation middleware
- invalid sex: expects 400 JSON from validation middleware
- blocked by guard: expects 500 (unhandled error)
- wrong method: expects 404 (no route match)
