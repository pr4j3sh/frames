#!/usr/bin/env node

const { program } = require("./src/args");
const registry = require("./src/registry");
const ui = require("./src/ui");
const { scaffold } = require("./src/run");

async function main() {
  program.parse(process.argv);
  const opts = program.opts();
  const args = program.args;

  if (opts.list) {
    const list = await registry.loadTemplates();
    if (opts.json) {
      process.stdout.write(JSON.stringify(list, null, 2) + "\n");
      return;
    }
    ui.printList(list);
    return;
  }

  if (opts.search) {
    const list = await registry.loadTemplates();
    const results = registry.search(list, opts.search);
    if (opts.json) {
      process.stdout.write(JSON.stringify(results, null, 2) + "\n");
      return;
    }
    if (results.length === 0) {
      ui.logError(`No templates match "${opts.search}".`);
      return;
    }
    ui.printList(results);
    return;
  }

  if (opts.info) {
    const list = await registry.loadTemplates();
    const template = registry.findTemplate(list, opts.info);
    if (opts.json) {
      if (!template) {
        process.stdout.write(
          JSON.stringify({ error: `Unknown template "${opts.info}"` }, null, 2) +
            "\n"
        );
        process.exitCode = 1;
      } else {
        process.stdout.write(JSON.stringify(template, null, 2) + "\n");
      }
      return;
    }
    if (!template) {
      const suggestion = registry.suggest(list, opts.info);
      ui.logError(
        suggestion
          ? `Unknown template "${opts.info}". Did you mean "${suggestion.repo}"?`
          : `Unknown template "${opts.info}". Run \`create-frames --list\` to see available templates.`
      );
      process.exitCode = 1;
      return;
    }
    ui.printInfo(template);
    return;
  }

  await scaffold(args, opts);
}

main().catch((error) => {
  ui.logError(error && error.message ? error.message : String(error));
  process.exitCode = 1;
});
