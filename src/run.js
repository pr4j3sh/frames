const pc = require("picocolors");
const { join } = require("node:path");
const { existsSync } = require("node:fs");
const { isCancel } = require("@clack/prompts");

const registry = require("./registry");
const steps = require("./steps");
const ui = require("./ui");

const VALID_PM = ["npm", "pnpm", "yarn", "bun"];

async function scaffold(args, opts) {
  if (opts.pm && !VALID_PM.includes(opts.pm)) {
    ui.logError(`Unknown package manager "${opts.pm}". Use one of: ${VALID_PM.join(", ")}.`);
    process.exitCode = 1;
    return;
  }

  const list = await registry.loadTemplates();

  let template = args[0] ? registry.findTemplate(list, args[0]) : null;

  if (args[0] && !template) {
    const suggestion = registry.suggest(list, args[0]);
    ui.logError(
      suggestion
        ? `Unknown template "${args[0]}". Did you mean "${suggestion.repo}"?`
        : `Unknown template "${args[0]}". Run \`create-frames --list\` to see available templates.`
    );
    process.exitCode = 1;
    return;
  }

  if (!template) {
    if (!process.stdout.isTTY) {
      ui.logError(
        "Provide a template name, e.g. `create-frames temp-blog`. Or run with --list."
      );
      process.exitCode = 1;
      return;
    }
    const chosen = await ui.selectTemplate(list);
    if (isCancel(chosen)) {
      ui.cancel();
      return;
    }
    template = registry.findTemplate(list, chosen);
  }

  let projectName = args[1];

  if (!projectName && !opts.yes) {
    if (process.stdout.isTTY) {
      const answer = await ui.askText("Project name", template.repo);
      if (isCancel(answer)) {
        ui.cancel();
        return;
      }
      projectName = answer.trim();
    }
  }
  projectName = projectName || template.repo;

  let install = opts.install;
  if (install && !opts.yes && process.stdout.isTTY) {
    const answer = await ui.askConfirm("Install dependencies?", true);
    if (isCancel(answer)) {
      ui.cancel();
      return;
    }
    install = answer;
  }

  try {
    steps.ensureDir(projectName, opts.force);
  } catch (error) {
    ui.logError(error.message);
    process.exitCode = 1;
    return;
  }

  if (opts.dryRun) {
    const dir = projectName === "." ? "." : projectName;
    const pm = opts.pm || steps.detectPm(dir);
    ui.note(
      [
        `  template  https://github.com/pr4j3sh/${template.repo}.git`,
        `  target    ${projectName}`,
        `  strip     .git, .github, LICENSE, CODE_OF_CONDUCT.md, CONTRIBUTING.md, Dockerfile`,
        `  env       ${opts.env ? "rename .env.example to .env (if present)" : "skip (--no-env)"}`,
        `  install   ${install ? `${pm} install` : "skip (--no-install)"}`,
        `  git       ${opts.git ? "git init" : "skip"}`,
      ].join("\n"),
      pc.bold("Dry run")
    );
    return;
  }

  ui.intro(`Scaffolding ${template.title}`);

  const spinner = ui.spinner();
  spinner.start("Cloning repository...");
  try {
    steps.clone(template.repo, projectName);
  } catch {
    spinner.stop("Clone failed");
    ui.logError(
      `Failed to clone ${template.repo}. Check the template name and your network connection.`
    );
    process.exitCode = 1;
    return;
  }
  spinner.stop("Repository cloned");

  const dir = projectName === "." ? "." : projectName;
  steps.strip(dir);

  if (opts.env) {
    steps.renameEnv(dir);
  }

  const runCommands = steps.runCommands(dir);
  const pm = opts.pm || steps.detectPm(dir);

  if (install && existsSync(join(dir, "package.json"))) {
    ui.logStep(`Installing dependencies with ${pm}...`);
    try {
      steps.install(pm, dir);
    } catch {
      ui.logError("Dependency install failed. See output above.");
      process.exitCode = 1;
      return;
    }
  } else if (install) {
    ui.logStep("No package.json found, skipping install.");
  }

  if (opts.git) {
    ui.logStep("Initializing git repository...");
    steps.gitInit(dir);
  }

  ui.printSummary({ projectName, pm, runCommands, template });
}

module.exports = { scaffold };
