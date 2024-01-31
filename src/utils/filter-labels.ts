import { GitHubLabel } from "../github-types";

export default async function filterLabels(
  labels: GitHubLabel[],
  regex: string
) {
  const SEARCH_QUERY_REGEX = new RegExp(regex); // "^Price:.+USDC$"

  const results = [] as GitHubLabel[];

  for (const label of labels as GitHubLabel[]) {
    const match = label.name.match(SEARCH_QUERY_REGEX)?.shift();
    if (match) {
      results.push(label);
    }
  }

  return results;
}
