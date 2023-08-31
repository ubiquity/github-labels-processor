import { Label } from "../network/label";
import { updateLabel } from "../network/update-label";

// const OWNER = 'ubiquity';
// const REPO = 'pay.ubq.fi';
// const regex = '^Price:.+';

// const GitHubReferenceColors = {
//   "1f883d": "green",
//   ededed: "grey",
// };

export default async function colorizeLabels(
  labels: string,
  args: {
    owner: string;
    repository: string;
    value: string;
  }
) {
  for (const label of labels) {
    console.trace(label);
    await updateLabel(args, label);
  }
}
