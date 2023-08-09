import { log } from "../cli/logging";
import { removeLabel } from "../network/remove-label";

export default async function _deleteLabels(
  args: { execute?: boolean },
  selected: string[]
) {
  log.warn(`delete labels: ${selected.join(", ")}`);

  if (args.execute) {
    for (const label of selected) {
      log.info(`deleting label: ${label}`);
      await removeLabel(args, label);
    }
  } else {
    log.info("dry run, not deleting labels. Use `--execute` to delete labels");
  }
}
