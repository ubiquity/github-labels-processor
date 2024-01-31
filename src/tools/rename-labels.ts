import { Args } from "../cli/cli-args";
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
  const labelsTo: (string | GitHubLabel)[] = Args.to;

  const fromStrings = labelsFrom.map(label =>
    typeof label === "string" ? label : label.name
  );
  const toStrings = labelsTo.map(label =>
    typeof label === "string" ? label : label.name
  );

  for (let i = 0; i < toStrings.length; i++) {
    const fromName = fromStrings[i];
    const toName = toStrings[i];
    await updateLabelName(fromName, toName);
  }
}
