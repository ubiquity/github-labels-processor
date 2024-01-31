import { log } from "../../cli/logging";
import { GitHubLabel } from "../../github-types";

export function checkIfLabelExists(labels: GitHubLabel[], newLabel: string) {
  log.info(`Checking if label ${newLabel} exists...`);
  const doesExist = labels.some((label) => label.name === newLabel);

  if (doesExist) {
    log.info(`Label ${newLabel} exists in the repository.`);
  } else {
    log.info(`Label ${newLabel} does not exist in the repository.`);
  }

  return doesExist;
}
