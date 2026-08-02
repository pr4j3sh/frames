const { homedir } = require("node:os");
const { join } = require("node:path");
const {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} = require("node:fs");

const bundled = require("../templates.json");

const RAW_URL =
  "https://raw.githubusercontent.com/pr4j3sh/frames/master/templates.json";
const CACHE_DIR = join(homedir(), ".cache", "frames");
const CACHE_FILE = join(CACHE_DIR, "templates.json");
const CACHE_TTL = 60 * 60 * 1000;
const FETCH_TIMEOUT = 4000;

function normalize(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.templates)) return data.templates;
  return [];
}

function readCache() {
  try {
    if (existsSync(CACHE_FILE)) {
      const age = Date.now() - statSync(CACHE_FILE).mtimeMs;
      const list = normalize(JSON.parse(readFileSync(CACHE_FILE, "utf8")));
      if (list.length) return { list, fresh: age < CACHE_TTL };
    }
  } catch {
    /* ignore corrupted cache */
  }
  return null;
}

function writeCache(list) {
  try {
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(
      CACHE_FILE,
      JSON.stringify({ version: 1, templates: list }, null, 2)
    );
  } catch {
    /* cache is best-effort */
  }
}

async function fetchLatest() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(RAW_URL, { signal: controller.signal });
    if (!res.ok) return null;
    const list = normalize(await res.json());
    return list.length ? list : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function loadTemplates() {
  const cached = readCache();
  if (cached && cached.fresh) return cached.list;

  const latest = await fetchLatest();
  if (latest) {
    writeCache(latest);
    return latest;
  }

  return cached ? cached.list : bundled.templates;
}

function findTemplate(list, repo) {
  return list.find((t) => t.repo === repo) || null;
}

function search(list, query) {
  const q = query.toLowerCase();
  return list.filter(
    (t) =>
      t.repo.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      (t.tech || []).some((x) => x.toLowerCase().includes(q))
  );
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const curr = [i];
    for (let j = 1; j <= n; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = curr;
  }
  return prev[n];
}

function suggest(list, name) {
  let best = null;
  let bestDistance = Infinity;
  for (const t of list) {
    const distance = levenshtein(name.toLowerCase(), t.repo.toLowerCase());
    if (distance < bestDistance) {
      bestDistance = distance;
      best = t;
    }
  }
  return bestDistance <= 3 ? best : null;
}

module.exports = {
  loadTemplates,
  findTemplate,
  search,
  suggest,
};
