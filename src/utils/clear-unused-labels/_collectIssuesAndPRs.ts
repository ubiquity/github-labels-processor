import { OWNER, REPO } from '../../config';
import { getGitHub } from '../../network/get';
import { Label } from '../../network/label';
import { singleItem } from '../example-response';

export async function collectIssuesAndPRs(): Promise<Map<string, number>> {
  const usedLabels = [] as string[];

  const issuesAndPRs = await getGitHub(
    `/repos/${OWNER}/${REPO}/issues?per_page=1000`
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
