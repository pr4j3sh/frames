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

try {
  execSync(`git clone ${repoUrl} ${projectName}`, { stdio: "inherit" });
  if (projectName !== ".") {
    chdir(projectName);
  }

  rmSync(".git", { recursive: true, force: true });
  if (existsSync(".github")) {
    rmSync(".github", { recursive: true, force: true });
  }
  if (existsSync("LICENSE")) {
    rmSync("LICENSE", { recursive: true, force: true });
  }

  console.log("");
  console.log("Installing dependencies...");
  execSync(`npm i`, { stdio: "inherit" });

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
  console.log("  npm run dev");
} catch (error) {
  exit(1);
}
