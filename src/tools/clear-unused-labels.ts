import { log } from "../cli/logging";
import { getGitHub } from "../network/get";
import { Label } from "../network/label";
import { singleItem } from "../utils/example-response";
import _deleteLabels from "./delete-labels";

export default async function clearUnusedLabels(
  args: {
    owner: string;
    repository: string;
    execute?: boolean;
  },
  selected: string[]
) {
  const usedLabelsWithCount = await getUsedLabelsWithCount(args);

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

  await _deleteLabels(args, unusedLabels);
}

async function getUsedLabelsWithCount(args: {
  owner: string;
  repository: string;
}): Promise<Map<string, number>> {
  const usedLabels = [] as string[];

  const issuesAndPRs = await getGitHub(
    `/repos/${args.owner}/${args.repository}/issues?per_page=1000`
  );

  for (const item of issuesAndPRs as typeof singleItem[]) {
    item.labels.forEach((label: Label) => {
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
