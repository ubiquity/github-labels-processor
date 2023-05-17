import { Label } from '../network/label';

export default async function filterLabels(
  labelsResponse: Label[],
  regex: RegExp
) {
  const results = [] as Label[];

  for (const label of labelsResponse as Label[]) {
    const match = label.name.match(regex)?.shift();
    if (match) {
      results.push(label);
    }
  }

  return results;
}
