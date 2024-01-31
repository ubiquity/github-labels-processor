import filterLabels from "../utils/filter-labels";
import getLabels from "../utils/get-labels";
import colorizeLabels from "./colorize-labels";

export default async function resetColors(args: {
  color?: string;
  owner: string;
  repository: string;
}) {
  // Get all labels.
  const allLabels = await getLabels();
  // do not select labels with `^Price:.+` regex
  const notPriceLabels = await filterLabels(allLabels, `^(?!Price:.+).+`);

  // Default to grey color.
  args.color = "ededed";
  await colorizeLabels(notPriceLabels);

  // Filter for `Price: ` labels.
  const priceLabels = await filterLabels(allLabels, `^Price:.+`);
  // Set `Price: ` labels to green.
  args.color = "1f883d";
  await colorizeLabels(priceLabels);
}
