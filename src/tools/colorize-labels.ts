import { args } from "../cli/cli-args";
import colorizeLabels from "../utils/colorize-labels";

export default async function _colorizeLabels(selected: string[]) {
  console.trace({
    args,
    selected,
  });
  if (selected) {
    await colorizeLabels(selected);
  }
}
