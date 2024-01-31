import { Args } from "../cli/cli-args";
import { log } from "../cli/logging";
import { GitHubLabel } from "../github-types";
import { getGitHub } from "../network/get";
import { singleItem } from "../utils/example-response";
import _deleteLabels from "./delete-labels";

export default async function clearUnusedLabels(selected: string[]) {
  const usedLabelsWithCount = await getUsedLabelsWithCount();

  // compare selected labels with used labels
  // delete selected labels that are not used
  const unusedLabels = [] as string[];
  for (const label of selected) {
    if (!usedLabelsWithCount.has(label)) {
      unusedLabels.push(label);
    }
  }

  if (unusedLabels.length === 0) {
    log.warn("No unused labels");
    return;
  }

  await _deleteLabels(unusedLabels);
}

async function getUsedLabelsWithCount(): Promise<Map<string, number>> {
  const usedLabels = [] as string[];

  const issuesAndPRs = await getGitHub(
    `/repos/${Args.owner}/${Args.repository}/issues?per_page=1000`
  );

  for (const item of issuesAndPRs as typeof singleItem[]) {
    item.labels.forEach((label: GitHubLabel) => {
      usedLabels.push(label.name);
    });
  }

  // count the number of times each label is used
  const usedLabelsWithCount = new Map();
  for (const label of usedLabels) {
    const count = (usedLabelsWithCount.get(label) || 0) as number;
    usedLabelsWithCount.set(label, count + 1);
  }

  return usedLabelsWithCount;
}
