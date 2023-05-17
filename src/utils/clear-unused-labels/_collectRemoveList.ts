import { getGitHub } from "../../network/get";
import { Label } from "../../network/label";

export async function collectRemoveList(
  {
    owner,
    repository,
    regex,
  }: { owner: string; repository: string; regex: string },
  usedLabelsWithCount: Map<string, number>
) {
  const allLabels = (await getGitHub(
    `/repos/${owner}/${repository}/labels?per_page=1000`
  )) as Label[];

  const removeList = new Set<string>();
  // delete all labels that are not in the preserve list
  for (const label of allLabels) {
    const match = label.name.match(regex)?.shift();
    if (match) {
      // add to the remove list if the label is not in the preserve list
      if (!usedLabelsWithCount.has(label.name)) {
        removeList.add(label.name);
      }
    } else {
      console.log(`Filtered out: "${label.name}"`);
    }
  }
  return removeList;
}
