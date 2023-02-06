import { OWNER, REPO } from '../../config';
import { getGitHub } from '../../network/get';
import { Label } from '../../network/label';

export async function collectRemoveList(
  usedLabelsWithCount: Map<string, number>
) {
  const allLabels = (await getGitHub(
    `/repos/${OWNER}/${REPO}/labels?per_page=1000`
  )) as Label[];

  const removeList = new Set<string>();
  // delete all labels that are not in the preserve list
  for (const label of allLabels) {
    // add to the remove list if the label is not in the preserve list
    if (!usedLabelsWithCount.has(label.name)) {
      removeList.add(label.name);
    }
  }
  return removeList;
}
