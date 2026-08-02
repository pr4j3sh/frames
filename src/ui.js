const pc = require("picocolors");
const clack = require("@clack/prompts");

function intro(text) {
  clack.intro(pc.bold(text));
}

function outro(text) {
  clack.outro(text);
}

function cancel(message = "Operation cancelled.") {
  clack.cancel(message);
}

function logError(message) {
  clack.log.error(message);
}

function logStep(message) {
  clack.log.step(message);
}

function note(message, title) {
  clack.note(message, title);
}

function spinner() {
  return clack.spinner();
}

async function selectTemplate(list) {
  return clack.select({
    message: "Choose a template",
    options: list
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((t) => ({
        value: t.repo,
        label: t.title,
        hint: (t.tech || []).join(", "),
      })),
  });
}

async function askText(message, initialValue) {
  return clack.text({
    message,
    initialValue,
    validate: (value) =>
      value && value.trim() ? undefined : "Please enter a project name",
  });
}

async function askConfirm(message, initialValue = true) {
  return clack.confirm({ message, initialValue });
}

function printList(list) {
  const sorted = list
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));
  const width = Math.max(...sorted.map((t) => t.repo.length));
  const lines = sorted.map(
    (t) =>
      pc.dim(t.repo.padEnd(width + 2)) +
      pc.bold(t.title) +
      pc.dim("  " + (t.tech || []).join(" · "))
  );
  note(lines.join("\n"), pc.bold("Available templates"));
  console.log(
    pc.dim(
      `  ${sorted.length} templates · create-frames --info <template> for details`
    )
  );
}

function printInfo(t) {
  const lines = [
    pc.bold(t.title),
    pc.dim(t.description || ""),
    "",
    `  repo     ${t.repo}`,
    t.demo ? `  demo     ${pc.cyan(t.demo)}` : null,
    `  source   ${pc.cyan(t.source || `https://github.com/pr4j3sh/${t.repo}/`)}`,
    t.tech && t.tech.length
      ? `  tags     ${pc.dim(t.tech.join(" · "))}`
      : null,
    "",
    `  usage    ${pc.green(
      `npm create @pr4j3sh/frames@latest ${t.repo} myapp`
    )}`,
  ].filter(Boolean);
  note(lines.join("\n"), pc.bold(t.title));
}

function printSummary({ projectName, pm, runCommands, template }) {
  const lines = [
    `  project  ${pc.bold(projectName)}`,
    `  package  ${pm}`,
    runCommands.length
      ? `  run${projectName === "." ? "" : `      cd ${projectName}`}\n` +
        runCommands.map((c) => `           ${pc.green(c)}`).join("\n")
      : null,
    "",
    `  template ${template.title}`,
    `  source   ${pc.cyan(template.source || `https://github.com/pr4j3sh/${template.repo}/`)}`,
  ].filter(Boolean);
  note(lines.join("\n"), pc.bold("Created!"));
  outro(pc.green("Happy building!"));
}

module.exports = {
  intro,
  outro,
  cancel,
  logError,
  logStep,
  note,
  spinner,
  selectTemplate,
  askText,
  askConfirm,
  printList,
  printInfo,
  printSummary,
};
