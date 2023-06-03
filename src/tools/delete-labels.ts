import { log } from "../cli/logging";

export default async function _deleteLabels(args, selected) {
  log.warn(`delete labels: ${selected.join(", ")}`);
  if (args.execute) {
    await deleteLabels(selected, args);
  }
}
