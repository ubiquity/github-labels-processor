import fs from "fs";
import filterLabels from "../utils/filter-labels";
import getLabels from "../utils/get-labels";
import { ARGS } from "./cli-args";
import { log } from "./logging";
export default async function cliEntry() {
  // Check for required arguments.
  if (!ARGS.owner || !ARGS.repository) {
    log.error("Missing required arguments: `owner`, `repository` (use -o, and -r)");
    process.exit(1);
  }

  if (!ARGS.tool) {
    log.info("No tool selected. Use `--tool` to select a tool.");
    const _tools = fs.readdirSync(`src/tools`);
    // remove .ts extension
    const tools = _tools.map((tool) => {
      if (tool.endsWith(`.ts`)) {
        return tool.slice(0, -3);
      }
    });

    const toolsList = tools.map((tool) => `\t\t${tool}`).join("\n");
    log.info(`Available tools:\n${toolsList}`);
  }

  // Get all labels.
  const labels = await getLabels();

  // Filter labels.
  if (!ARGS.regex) {
    ARGS.regex = ".*"; // Match everything.
  }

  const selected = await filterLabels(labels, ARGS.regex);

  const selectedBuffer = selected.map((label) => label.name);
  log.ok(`Selected the following labels:\n\n${selectedBuffer.join("\n")}`);

  // Select tool
  if (ARGS.tool) {
    const tool = await import(`../tools/${ARGS.tool}`);
    return await tool.default(selectedBuffer);
  }
}
