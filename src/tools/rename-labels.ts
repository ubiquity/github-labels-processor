import { GitHubLabel } from "../github-types";
import { updateLabelName } from "../network/update-label-name";

// const OWNER = 'ubiquity';
// const REPO = 'pay.ubq.fi';
// const regex = '^Price:.+';

// const GitHubReferenceColors = {
//   "1f883d": "green",
//   ededed: "grey",
// };

export default async function renameLabels(
  labelsFrom: (string | GitHubLabel)[]
) {
  const fromStrings = labelsFrom.map(label =>
    typeof label === "string" ? label : label.name
  );

  for (const fromName of fromStrings) {
    const response = await updateLabelName(fromName);
    console.trace({ response });
  }
}
