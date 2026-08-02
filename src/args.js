const { Command } = require("commander");
const pkg = require("../package.json");

const program = new Command();

program
  .name("create-frames")
  .description("Scaffold a project from a frames template")
  .argument("[template]", "template name (e.g. temp-blog)")
  .argument("[projectName]", "project directory name (defaults to the template name)")
  .usage("[template] [projectName] [options]")
  .version(pkg.version, "-V, --version", "output the version number")
  .option("-l, --list", "list available templates")
  .option("-s, --search <query>", "search templates by title, tech, or repo")
  .option("-i, --info <template>", "show details for a template")
  .option("-y, --yes", "skip prompts and use defaults")
  .option("-f, --force", "overwrite an existing directory")
  .option("--pm <manager>", "package manager for install (npm | pnpm | yarn | bun)")
  .option("--no-install", "skip dependency install")
  .option("--no-env", "skip renaming .env.example to .env")
  .option("--git", "initialize a fresh git repository")
  .option("--dry-run", "print the actions without doing them")
  .option("--json", "machine-readable output for --list, --search, --info");

module.exports = { program };
