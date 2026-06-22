// Build index.json — the catalogue the Vanta app searches.
//
// Scans methods/ and routines/ for their identity files and emits one summary
// list each (the cheap, browsable part). The app downloads this single file from
// Cloudflare and searches it locally; the full item is fetched only on install.
// Run by the Build-index GitHub Action on any methods/ or routines/ change.

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

// tags[] is the source of truth; fall back to a legacy single `category` string.
function readTags(meta) {
  const source = Array.isArray(meta.tags)
    ? meta.tags
    : typeof meta.category === "string"
      ? [meta.category]
      : [];
  const seen = new Set();
  const tags = [];
  for (const entry of source) {
    if (typeof entry !== "string") continue;
    const t = entry.trim();
    if (t && !seen.has(t)) {
      seen.add(t);
      tags.push(t);
    }
  }
  return tags;
}

function listFolders(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && statSync(join(dir, e.name)).isDirectory())
    .map((e) => e.name)
    .sort();
}

function buildMethods() {
  const dir = join(ROOT, "methods");
  const out = [];
  for (const id of listFolders(dir)) {
    const file = join(dir, id, "method.json");
    if (!existsSync(file)) continue;
    try {
      const meta = readJson(file);
      out.push({
        id,
        name: typeof meta.name === "string" ? meta.name : id,
        description: typeof meta.description === "string" ? meta.description : "",
        version: typeof meta.version === "string" ? meta.version : "0.0.0",
        owner: typeof meta.owner === "string" ? meta.owner : "",
        tags: readTags(meta),
      });
    } catch (error) {
      console.warn(`Skipping invalid method "${id}":`, error.message);
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function buildRoutines() {
  const dir = join(ROOT, "routines");
  const out = [];
  for (const id of listFolders(dir)) {
    const file = join(dir, id, "routine.json");
    if (!existsSync(file)) continue;
    try {
      const meta = readJson(file);
      out.push({
        id,
        name: typeof meta.name === "string" ? meta.name : id,
        description: typeof meta.description === "string" ? meta.description : "",
        version: typeof meta.version === "string" ? meta.version : "0.0.0",
        owner: typeof meta.owner === "string" ? meta.owner : "",
        tags: readTags(meta),
        mode: meta.mode === "accumulate" ? "accumulate" : "one-shot",
        stepCount: Array.isArray(meta.flow) ? meta.flow.length : 0,
      });
    } catch (error) {
      console.warn(`Skipping invalid routine "${id}":`, error.message);
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

const methods = buildMethods();
const routines = buildRoutines();
const index = { schemaVersion: 1, methods, routines };

writeFileSync(join(ROOT, "index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8");
console.log(`index.json: ${methods.length} methods, ${routines.length} routines`);
