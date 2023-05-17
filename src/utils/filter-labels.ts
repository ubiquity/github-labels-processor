import { Label } from '../network/label';

export default async function filterLabels(labels: Label[], regex: string) {
  const SEARCH_QUERY_REGEX = new RegExp(regex); // "^Price:.+USDC$"

  const results = [] as Label[];

  for (const label of labels as Label[]) {
    const match = label.name.match(SEARCH_QUERY_REGEX)?.shift();
    if (match) {
      results.push(label);
    }
  }

  return results;
}
