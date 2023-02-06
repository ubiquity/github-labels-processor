import dotenv from 'dotenv';
import { OWNER, REPO } from '../config';
import { getGitHub } from '../network/get';

import { Label } from '../network/label';
import { removeLabel } from '../network/removeLabel';
import { singleItem } from './example-response';

dotenv.config();
export const token = process.env.GITHUB_TOKEN;
if (token === undefined) {
  throw new Error('GITHUB_TOKEN is not defined');
}

export default async function clearUnusedLabels() {
  const issuesAndPRs = await getGitHub(
    `/repos/${OWNER}/${REPO}/issues?per_page=1000`
  );

  const preserveList = new Set<string>();

  for (const item of issuesAndPRs as typeof singleItem[]) {
    item.labels.forEach((label: Label) => {
      preserveList.add(label.name);
    });
  }

  console.log('preserveList: ');
  console.log(preserveList);

  const labelsResponse = await getGitHub(
    `/repos/${OWNER}/${REPO}/labels?per_page=1000`
  );

  // delete all labels that are not in the preserve list
  for (const label of labelsResponse as Label[]) {
    if (!preserveList.has(label.name)) {
      console.log(`Removing label: "${label.name}"`);
      await removeLabel(label.name);
    }
  }
}
