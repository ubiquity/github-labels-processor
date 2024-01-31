import { GitHubLabel } from "../github-types";
import { updateLabelColor } from "../network/update-label-color";

// const OWNER = 'ubiquity';
// const REPO = 'pay.ubq.fi';
// const regex = '^Price:.+';

// const GitHubReferenceColors = {
//   "1f883d": "green",
//   ededed: "grey",
// };

export default async function colorizeLabels(labels: (string | GitHubLabel)[]) {
  for (const label of labels) {
    const labelName = typeof label === "string" ? label : label.name;
    await updateLabelColor(labelName);
  }
}
