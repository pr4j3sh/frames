#!/usr/bin/env node

const { execSync } = require("node:child_process");
const { exit, chdir } = require("node:process");
const { renameSync, existsSync, rmSync } = require("node:fs");

const args = process.argv.slice(2);

const repo = args[0];
if (!repo) {
  console.error("provide a template name");
  exit(1);
}
const repoUrl = `https://github.com/pr4j3sh/${repo}.git`;
const projectName = args[1] || repo;

const rm = [
  ".git",
  ".github",
  "LICENSE",
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "Dockerfile",
];

try {
  execSync(`git clone ${repoUrl} ${projectName}`, { stdio: "inherit" });
  if (projectName !== ".") {
    chdir(projectName);
  }

  rm.forEach((item) => {
    if (existsSync(item)) {
      rmSync(item, { recursive: true, force: true });
    }
  });

  if (existsSync("package.json")) {
    console.log("");
    console.log("Installing dependencies...");
    execSync(`npm i`, { stdio: "inherit" });
  }

  if (existsSync(".env.example")) {
    console.log("");
    console.log("Creating .env file");
    renameSync(".env.example", ".env");
  }

  console.log("");
  console.log("Use command(s)");
  if (projectName !== ".") {
    console.log(`  cd ${projectName}`);
  }
  if (existsSync("package.json")) {
    console.log("  npm run dev");
  } else if (existsSync("Cargo.toml")) {
    console.log("  cargo run");
  } else if (existsSync("Makefile")) {
    console.log("  make run");
  } else if (existsSync("pyproject.toml")) {
    console.log("  python -m package.main");
  }
} catch (error) {
  console.error(error);
  exit(1);
}
