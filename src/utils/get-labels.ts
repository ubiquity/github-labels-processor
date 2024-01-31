import { getGitHub } from "../network/get";
import { getGitHubRaw } from "../network/get-raw";
import { GitHubLabel } from "../network/label";

export default async function getLabels({
  owner,
  repository,
}: {
  owner: string;
  repository: string;
}): Promise<GitHubLabel[]> {
  const labelsResponse = await getGitHub(
    `/repos/${owner}/${repository}/labels?per_page=1000`
  );

  return labelsResponse as GitHubLabel[];
}

export async function getAllLabels({
  owner,
  repository,
}: {
  owner: string;
  repository: string;
}): Promise<GitHubLabel[]> {
  // get all of the pages of labels
  const labelsResponse = await getGitHubRaw(
    `/repos/${owner}/${repository}/labels?per_page=100`
  );

  if (!labelsResponse.headers.link) {
    return (await getLabels({
      owner,
      repository,
    })) as GitHubLabel[]; // TODO: fix
  }

  const links = labelsResponse.headers.link.split(",");
  const lastLink = links.find(link => link.includes('rel="last"'));

  if (!lastLink) {
    throw new Error("No last link");
  }

  // in the string `<https://api.github.com/repositories/627868244/labels?per_page=100&page=6>; rel="last"` do NOT select `per_page=100` but select `page=6`

  const lastPage = lastLink.match(/page=(\d+)>; rel="last"/)[1];
  const labels = [] as GitHubLabel[];

  for (let page = 1; page <= parseInt(lastPage, 10); page++) {
    const pageLabelsResponse = (await getGitHub(
      `/repos/${owner}/${repository}/labels?per_page=100&page=${page}`
    )) as GitHubLabel[];

    labels.push(...pageLabelsResponse);
  }
  return labels;
}
