import filterLabels from "../utils/filter-labels";
import { getAllLabels } from "../utils/get-labels";
import args from "./cli-args";
import { log } from "./logging";
import fs from "fs";
export default async function cliEntry() {
  // Check for required arguments.
  if (!args.owner || !args.repository) {
    log.error(
      "Missing required arguments: `owner`, `repository` (use -o, and -r)"
    );
    process.exit(1);
  }

  if (!args.tool) {
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
  const labels = await getAllLabels(
    args as { owner: string; repository: string }
  );

  // Filter labels.
  if (!args.regex) {
    args.regex = ".*"; // Match everything.
  }

  const selected = await filterLabels(labels, args.regex);

  const selectedBuffer = selected.map(label => label.name);
  log.ok(`Selected the following labels:\n\n${selectedBuffer.join("\n")}`);

  // Select tool
  if (args.tool) {
    const tool = await import(`../tools/${args.tool}`);
    return await tool.default(args, selectedBuffer);
  }
}
