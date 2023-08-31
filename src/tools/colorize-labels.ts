import { Label } from "../network/label";
import colorizeLabels from "../utils/colorize-labels";

export default async function _colorizeLabels(
  args: {
    owner: string;
    repository: string;
    value: string;
  },
  selected: Label[]
) {
  // Colorize labels.
  if (args.value) {
    await colorizeLabels(selected, args);
  }
}
