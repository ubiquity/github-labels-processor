import { Label } from "../network/label";
import colorizeLabels from "../utils/colorize-labels";

export default async function _colorizeLabels(
  args: { color: string },
  selected: Label[]
) {
  // Colorize labels.
  if (args.color) {
    await colorizeLabels(selected, args);
  }
}
