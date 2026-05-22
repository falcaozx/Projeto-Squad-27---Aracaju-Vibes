import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const clientDir = path.join(root, "dist", "client");
const publicDir = path.join(root, "public");
const publicAssetsDir = path.join(publicDir, "assets");
const clientAssetsDir = path.join(clientDir, "assets");

if (!existsSync(clientAssetsDir)) {
  throw new Error(`Client assets not found at ${clientAssetsDir}. Run the Vite build first.`);
}

await rm(publicAssetsDir, { recursive: true, force: true });
await mkdir(publicDir, { recursive: true });
await cp(clientAssetsDir, publicAssetsDir, { recursive: true });
