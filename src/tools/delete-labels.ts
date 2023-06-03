import { log } from "../cli/logging";
import { removeLabel } from "../network/remove-label";

export default async function _deleteLabels(args, selected) {
  log.warn(`delete labels: ${selected.join(", ")}`);

  if (args.execute) {
    for (const label of selected) {
      log.info(`deleting label: ${label}`);
      await removeLabel(args, label);
    }
  }
}
