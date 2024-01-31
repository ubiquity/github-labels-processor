import { log } from "../cli/logging";
import { removeLabel } from "../network/remove-label";

export default async function _deleteLabels(selected: string[]) {
  log.warn(`delete labels: ${selected.join(", ")}`);
  for (const label of selected) {
    log.info(`deleting label: ${label}`);
    await removeLabel(label);
  }
}
