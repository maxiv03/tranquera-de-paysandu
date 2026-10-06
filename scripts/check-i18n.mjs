// Verifies that every locale in messages/ has the same keys as the default locale (es),
// no empty values, and the same ICU arguments ({count}, {date}...) per key.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(import.meta.dirname, "..", "messages");
const base = "es";

function flatten(obj, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") flatten(value, path, out);
    else out[path] = String(value);
  }
  return out;
}

// Top-level ICU argument names, e.g. "{count, plural, one {# lote} other {# lotes}}" -> count
function args(message) {
  const names = new Set();
  let depth = 0;
  for (let i = 0; i < message.length; i++) {
    if (message[i] === "{") {
      if (depth === 0) {
        const match = /^\{\s*([A-Za-z_]\w*)/.exec(message.slice(i));
        if (match) names.add(match[1]);
      }
      depth++;
    } else if (message[i] === "}") depth--;
  }
  return [...names].sort().join(",");
}

const load = (locale) =>
  flatten(JSON.parse(readFileSync(join(dir, `${locale}.json`), "utf8")));
const locales = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(".json", ""));
const reference = load(base);
const errors = [];

for (const locale of locales) {
  const messages = load(locale);
  for (const [key, value] of Object.entries(messages)) {
    if (!value.trim()) errors.push(`[${locale}] empty value: ${key}`);
  }
  if (locale === base) continue;
  for (const key of Object.keys(reference)) {
    if (!(key in messages)) errors.push(`[${locale}] missing key: ${key}`);
    else if (args(reference[key]) !== args(messages[key]))
      errors.push(`[${locale}] argument mismatch in ${key}`);
  }
  for (const key of Object.keys(messages)) {
    if (!(key in reference)) errors.push(`[${locale}] extra key not in ${base}: ${key}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n✗ ${errors.length} i18n problem(s)`);
  process.exit(1);
}
console.log(`✓ ${locales.join(", ")}: ${Object.keys(reference).length} keys in sync`);
