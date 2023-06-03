import colorizeLabels from "../utils/colorize-labels";

export default async function _colorizeLabels(args, selected) {
  // Colorize labels.
  if (args.color) {
    await colorizeLabels(selected, args);
  }
}
