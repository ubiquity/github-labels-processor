import { ARGS } from "../cli/cli-args";
import { log } from "../cli/logging";
import { GitHubLabel } from "../github-types";
import { updateLabelColor } from "../network/update-label-color";
import filterLabels from "../utils/filter-labels";
import colorizeLabels from "./colorize-labels";
import deleteLabelsWrapper from "./delete-labels";
import { updateIssueLabelsWrapper } from "./migrate-priority-labels/update-issue-labels";
import { checkIfLabelExists } from "./migrate-priority-labels/check-if-label-exists";
import { createNewLabel } from "./migrate-priority-labels/create-new-label";
import { getAllLabels } from "./migrate-priority-labels/get-all-labels";
import { priorityMapping } from "./migrate-priority-labels/priority-mapping";
import { updateLabelName } from "./migrate-priority-labels/update-label-name";

export default async function assistivePricingLabelsNormalizer() {
  const allLabels = await getAllLabels();

  for (const [oldLabel, newLabel] of Object.entries(priorityMapping)) {
    try {
      const doesExist = checkIfLabelExists(allLabels, newLabel); // 1. check if the new label exists
      await createNewLabel(doesExist, newLabel); // 2. if not, create it
      await updateIssueLabelsWrapper(oldLabel, newLabel); // 3. update all issues with the old label to the new label
      await deleteLabelsWrapper([oldLabel]); // 4. delete the old label
      await updateLabelName(oldLabel, newLabel);
    } catch (error) {
      if (error instanceof Error) log.error(error.message);
      else console.error(error);
    }
  }

  ARGS.color = "ededed";
  await resetColors(Object.values(priorityMapping));
  await resetColors(["Time: <1 Hour", "Time: <2 Hours", "Time: <4 Hours", "Time: <1 Day", "Time: <1 Week", "Time: <2 Weeks", "Time: <1 Month"]);

  await deletePriceRangeLabels(allLabels);
  // Filter for `Price: ` labels.
  const allLabelsAfterDeletion = await getAllLabels();
  const priceLabels = await filterLabels(allLabelsAfterDeletion, `^Price:.+`);
  // Set `Price: ` labels to green.
  ARGS.color = "1f883d";
  await colorizeLabels(priceLabels);
}

async function deletePriceRangeLabels(allLabels: GitHubLabel[]) {
  const plusSignLabelRegex = /^Price:\s\d+(\.\d+)?\+\sUSD$/; // regex to match labels with a plus sign
  const rangePriceLabels = allLabels.filter((label) => plusSignLabelRegex.test(label.name));
  await deleteLabelsWrapper(rangePriceLabels.map((label) => label.name));
}

async function resetColors(labels: string[]) {
  for (const label of labels) {
    const response = await updateLabelColor(label);
    console.trace({ response });
  }
}
