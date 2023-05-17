import colorizeLabels from "../utils/colorize-labels";
import filterLabels from "../utils/filter-labels";
import { getAllLabels } from "../utils/get-labels";

export default async function resetColors(args) {
  // Get all labels.
  const allLabels = await getAllLabels(args);
  args.regex = ".*";

  // Default to grey color.
  args.color = "ededed";
  await colorizeLabels(allLabels, args);

  // Filter for `Price: ` labels.
  const priceLabels = await filterLabels(allLabels, `^Price:.+`);
  // Set `Price: ` labels to green.
  args.color = "1f883d";
  await colorizeLabels(priceLabels, args);
}
