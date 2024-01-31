import fs from "fs";
import filterLabels from "../utils/filter-labels";
import getLabels from "../utils/get-labels";
import { Args } from "./cli-args";
import { log } from "./logging";
export default async function cliEntry() {
  // Check for required arguments.
  if (!Args.owner || !Args.repository) {
    log.error(
      "Missing required arguments: `owner`, `repository` (use -o, and -r)"
    );
    process.exit(1);
  }

  if (!Args.tool) {
    log.info("No tool selected. Use `--tool` to select a tool.");
    const _tools = fs.readdirSync(`src/tools`);
    // remove .ts extension
    const tools = _tools.map(tool => {
      if (tool.endsWith(`.ts`)) {
        return tool.slice(0, -3);
      }
    });

    log.info(`Available tools:\n\t\t${tools.join(`\n\t\t`)}`);
  }

  // Get all labels.
  const labels = await getLabels();

  // Filter labels.
  if (!Args.regex) {
    Args.regex = ".*"; // Match everything.
  }

  const selected = await filterLabels(labels, Args.regex);

  const selectedBuffer = selected.map(label => label.name);
  log.ok(`Selected the following labels:\n\n${selectedBuffer.join("\n")}`);

  // Select tool
  if (Args.tool) {
    const tool = await import(`../tools/${Args.tool}`);
    return await tool.default(selectedBuffer);
  }
}
