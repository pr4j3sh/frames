const { execSync } = require("node:child_process");
const { join } = require("node:path");
const {
  existsSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
} = require("node:fs");

const STRIP = [
  ".git",
  ".github",
  "LICENSE",
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "Dockerfile",
];

const INSTALL = {
  npm: "npm install",
  pnpm: "pnpm install",
  yarn: "yarn install",
  bun: "bun install",
};

function clone(repo, dir) {
  execSync(`git clone https://github.com/pr4j3sh/${repo}.git ${dir}`, {
    stdio: "ignore",
  });
}

function strip(dir) {
  for (const item of STRIP) {
    const target = join(dir, item);
    if (existsSync(target)) {
      rmSync(target, { recursive: true, force: true });
    }
  }
}

function renameEnv(dir) {
  const source = join(dir, ".env.example");
  if (existsSync(source)) {
    renameSync(source, join(dir, ".env"));
  }
}

function detectPm(dir) {
  try {
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
    if (typeof pkg.packageManager === "string") {
      const name = pkg.packageManager.split("@")[0];
      if (INSTALL[name]) return name;
    }
  } catch {
    /* no package.json */
  }
  const lockfiles = {
    "pnpm-lock.yaml": "pnpm",
    "yarn.lock": "yarn",
    "bun.lockb": "bun",
    "package-lock.json": "npm",
  };
  for (const [file, pm] of Object.entries(lockfiles)) {
    if (existsSync(join(dir, file))) return pm;
  }
  return "npm";
}

function install(pm, dir) {
  execSync(INSTALL[pm] || "npm install", { cwd: dir, stdio: "inherit" });
}

function gitInit(dir) {
  execSync("git init", { cwd: dir, stdio: "inherit" });
}

function runCommands(dir) {
  if (existsSync(join(dir, "package.json"))) return ["npm run dev"];
  if (existsSync(join(dir, "Cargo.toml"))) return ["cargo run"];
  if (existsSync(join(dir, "Makefile"))) return ["make run"];
  if (existsSync(join(dir, "pyproject.toml"))) return ["python -m package.main"];
  return [];
}

function ensureDir(name, force) {
  if (name === ".") {
    if (readdirSync(".").length > 0 && !force) {
      throw new Error(
        "Current directory is not empty. Use --force to continue."
      );
    }
    return;
  }
  if (!existsSync(name)) return;
  if (statSync(name).isDirectory() && readdirSync(name).length === 0) return;
  if (force) {
    rmSync(name, { recursive: true, force: true });
    return;
  }
  throw new Error(
    `Directory "${name}" already exists and is not empty. Use --force to overwrite it.`
  );
}

module.exports = {
  clone,
  strip,
  renameEnv,
  detectPm,
  install,
  gitInit,
  runCommands,
  ensureDir,
};
