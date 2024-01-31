import { log } from "../cli/logging";
import _deleteLabels from "./delete-labels";
import { checkIfLabelExists } from "./migrate-priority-labels/check-if-label-exists";
import { createNewLabel } from "./migrate-priority-labels/create-new-label";
import { getAllLabels } from "./migrate-priority-labels/get-all-labels";
import { priorityMapping } from "./migrate-priority-labels/priority-mapping";
import { updateLabelName } from "./migrate-priority-labels/update-label-name";
import { _updateIssueLabels } from "./migrate-priority-labels/_update-issue-labels";

export default async function migratePriorityLabels() {
  const allLabels = await getAllLabels();

  for (const [oldLabel, newLabel] of Object.entries(priorityMapping)) {
    try {
      const labelExists = checkIfLabelExists(allLabels, newLabel); // 1. check if the new label exists
      await createNewLabel(labelExists, newLabel); // 2. if not, create it
      await _updateIssueLabels(oldLabel, newLabel); // 3. update all issues with the old label to the new label
      await _deleteLabels([oldLabel]); // 4. delete the old label
      await updateLabelName(oldLabel, newLabel);
    } catch (error) {
      if (error instanceof Error) log.error(error.message);
      else console.error(error);
    }
  }
}
