const assert = require("assert");
const { readFileSync, existsSync } = require("fs");

function expectContains(file, text) {
  const content = readFileSync(file, "utf-8");
  assert(content.includes(text), `${file} missing expected text: ${text}`);
}

function run() {
  assert(existsSync("app/api/chat/route.ts"), "chat route must exist");
  assert(existsSync("app/api/health/route.ts"), "health route must exist");
  assert(existsSync("app/api/leads/route.ts"), "leads route must exist");

  expectContains("app/api/chat/route.ts", "enforceRateLimit");
  expectContains("app/api/chat/route.ts", "generateSupportReply");
  expectContains("lib/ai/prompts.ts", "HALLUCINATION PREVENTION");
  expectContains("lib/utils/validation.ts", "chatRequestSchema");

  console.log("All structural checks passed.");
}

run();
