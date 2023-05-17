import { removeLabel } from "../../network/removeLabel";
import { collectIssuesAndPRs } from "./_collectIssuesAndPRs";
import { collectRemoveList } from "./_collectRemoveList";

const token = process.env.GITHUB_TOKEN;

if (token === undefined) {
  throw new Error("GITHUB_TOKEN is not defined");
}

export default async function clearUnusedLabels() {
  const usedLabelsWithCount = await collectIssuesAndPRs();
  console.log({ usedLabelsWithCount });

  const removeList = await collectRemoveList(usedLabelsWithCount);
  console.log({ removeList });

  console.log("Waiting 10 seconds before removing labels...");

  setTimeout(async () => {
    for (const label of removeList) {
      console.log(`Removing label: ${label}`);
      await removeLabel(label);
    }
  }, 10000);
}
