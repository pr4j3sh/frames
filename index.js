#!/usr/bin/env node

const { execSync } = require("node:child_process");
const { exit, chdir } = require("node:process");
const { renameSync, existsSync, rmSync } = require("node:fs");

const args = process.argv.slice(2);

if (!args[0]) {
  console.error("provide a template name");
  exit(1);
}
const repoUrl = `https://github.com/pr4j3sh/${args[0]}.git`;
const projectName = args[1] || args[0];

try {
  execSync(`git clone ${repoUrl} ${projectName}`, { stdio: "inherit" });
  if (projectName !== ".") {
    chdir(projectName);
  }

  rmSync(".git", { recursive: true, force: true });

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
