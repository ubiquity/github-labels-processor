import { Label } from "../network/label";
import { updateLabel } from "../network/updateLabel";

// const OWNER = 'ubiquity';
// const REPO = 'pay.ubq.fi';
// const regex = '^Price:.+';

const GitHubReferenceColors = {
  "1f883d": "green",
  ededed: "grey",
};

export default async function colorizeLabels(labels: Label[], args) {
  labels.forEach(
    async (label: Label) => await updateLabel(args, label.name, args)
  );
}
