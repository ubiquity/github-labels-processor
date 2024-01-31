import { log } from "../../cli/logging";
import { updateIssueLabels } from "./update-issue-labels";

export async function _updateIssueLabels(oldLabel: string, newLabel: string) {
  log.info(`Starting to update issue labels from ${oldLabel} to ${newLabel}`);
  try {
    await updateIssueLabels(oldLabel, newLabel);
    log.ok(`Successfully updated issue labels from ${oldLabel} to ${newLabel}`);
  } catch (error) {
    if (error instanceof Error) {
      log.error(`Failed to update issue label ${oldLabel} to ${newLabel}: ${error.message}`);
    } else {
      console.error(error);
    }
  }
}
