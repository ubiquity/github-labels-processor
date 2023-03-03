import dotenv from 'dotenv';
import { OWNER, REPO, SEARCH_QUERY_REGEX } from './config';
import { getGitHub } from './network/get';
import { Label } from './network/label';
dotenv.config();
export const token = process.env.GITHUB_TOKEN;
if (token === undefined) {
  throw new Error('GITHUB_TOKEN is not defined');
}

export default async function main() {
  const labelsResponse = await getGitHub(
    `/repos/${OWNER}/${REPO}/labels?per_page=1000`
  );

  console.log(labelsResponse);

  for (const label of labelsResponse as Label[]) {
    const match = label.name.match(SEARCH_QUERY_REGEX)?.shift();
    if (match) {
      console.log(`Processing label: "${label.name}"`);
      // await removeLabel(label.name);
      // await updateLabel(label.name, {color: "000000"});
      return console.log(`no logic implemented yet`);
    } else {
      console.log(`Filtered out: "${label.name}"`);
    }
  }
}
