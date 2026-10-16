import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, normalize, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");
const distDir = join(root, "dist");

const config = JSON.parse(await readFile(join(root, "site.config.json"), "utf8"));

const required = ["brand", "mascot", "domain", "supportEmail", "appStoreUrl", "playStoreUrl"];
for (const key of required) {
  if (typeof config[key] !== "string" || config[key].trim() === "") {
    throw new Error(`site.config.json: "${key}" must be a non-empty string`);
  }
}

function assertUrl(name, value) {
  if (!/^(https?:\/\/|#)/.test(value)) {
    throw new Error(`${name} must start with http://, https://, or #`);
  }
}

assertUrl("appStoreUrl", config.appStoreUrl.trim());
assertUrl("playStoreUrl", config.playStoreUrl.trim());

if (!config.supportEmail.includes("@")) {
  throw new Error('site.config.json: "supportEmail" must look like an email address');
}

const tokens = {
  brand: config.brand.trim(),
  mascot: config.mascot.trim(),
  domain: config.domain.trim(),
  supportEmail: config.supportEmail.trim(),
  appStoreUrl: config.appStoreUrl.trim(),
  playStoreUrl: config.playStoreUrl.trim(),
  year: String(new Date().getFullYear()),
};

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function fill(text, file) {
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
    if (!(key in tokens)) {
      throw new Error(`${file}: unknown token ${match}`);
    }
    return escapeHtml(tokens[key]);
  });
}

async function resolveIncludes(text, stack = []) {
  const pattern = /<!--\s*include:([a-zA-Z0-9_./-]+)\s*-->/g;
  let result = "";
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    result += text.slice(last, match.index);
    const rel = match[1];
    if (stack.includes(rel)) {
      throw new Error(`include cycle at ${rel}`);
    }
    const full = normalize(join(srcDir, rel));
    if (full !== srcDir && !full.startsWith(srcDir + sep)) {
      throw new Error(`include escapes src: ${rel}`);
    }
    const partial = await readFile(full, "utf8");
    result += await resolveIncludes(partial, [...stack, rel]);
    last = match.index + match[0].length;
  }
  result += text.slice(last);
  return result;
}

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await cp(srcDir, distDir, { recursive: true });

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "partials") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.name.endsWith(".html")) {
      const raw = await readFile(full, "utf8");
      const included = await resolveIncludes(raw);
      const rendered = fill(included, relative(root, full));
      if (rendered.includes("{{")) {
        throw new Error(`${relative(root, full)} still has unreplaced tokens`);
      }
      await writeFile(full, rendered);
    }
  }
}

await walk(distDir);
await rm(join(distDir, "partials"), { recursive: true, force: true });

const home = await readFile(join(distDir, "index.html"), "utf8");
for (const id of ["how", "features", "faq", "download"]) {
  if (!home.includes(`id="${id}"`)) {
    throw new Error(`index.html is missing #${id}`);
  }
}
for (const label of ["App Store", "Google Play", tokens.brand, tokens.mascot]) {
  if (!home.includes(label)) {
    throw new Error(`index.html is missing "${label}"`);
  }
}

console.log(`Built ${tokens.brand} landing page into dist/`);
