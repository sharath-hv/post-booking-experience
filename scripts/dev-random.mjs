#!/usr/bin/env node
/**
 * Picks a random port in [3000, 9999] and starts `next dev`.
 * Run: npm run dev
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = 3000 + Math.floor(Math.random() * 7000);

console.log(`\n  ▶ Local:   http://localhost:${port}\n`);

const child = spawn(
  "npx",
  ["next", "dev", "--turbopack", "--port", String(port)],
  { cwd: root, stdio: "inherit", shell: true },
);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});

process.on("SIGINT", () => {
  child.kill("SIGINT");
});
process.on("SIGTERM", () => {
  child.kill("SIGTERM");
});
