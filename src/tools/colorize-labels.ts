import { updateLabel } from "../network/update-label";

// const OWNER = 'ubiquity';
// const REPO = 'pay.ubq.fi';
// const regex = '^Price:.+';

// const GitHubReferenceColors = {
//   "1f883d": "green",
//   ededed: "grey",
// };

export default async function colorizeLabels(labels: string[]) {
  for (const label of labels) {
    await updateLabel(label);
  }
}
