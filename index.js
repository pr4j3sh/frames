const { execSync } = require("node:child_process");
const { exit, chdir } = require("node:process");

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
  execSync(`npm i`, { stdio: "inherit" });
} catch (error) {
  exit(1);
}
