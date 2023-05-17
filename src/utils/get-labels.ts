import { getGitHub } from "../network/get";
import { Label } from "../network/label";

export default async function getLabels({
  owner,
  repository,
}: {
  owner: string;
  repository: string;
}): Promise<Label[]> {
  const labelsResponse = await getGitHub(
    `/repos/${owner}/${repository}/labels?per_page=1000`
  );

  return labelsResponse as Label[];
}

export async function getAllLabels({
  owner,
  repository,
}: {
  owner: string;
  repository: string;
}): Promise<Label[]> {
  // get all of the pages of labels
  const labelsResponse = await getGitHub(
    `/repos/${owner}/${repository}/labels?per_page=100`
  );

  const labels = labelsResponse as Label[];

  const links = labelsResponse.headers.link.split(",");
  const lastLink = links.find(link => link.includes('rel="last"'));

  if (lastLink) {
    const lastPage = lastLink.match(/page=(\d+)/)[1];

    for (let page = 2; page <= parseInt(lastPage, 10); page++) {
      const pageLabelsResponse = await getGitHub(
        `/repos/${owner}/${repository}/labels?per_page=100&page=${page}`
      );

      const pageLabels = pageLabelsResponse as Label[];

      labels.push(...pageLabels);
    }
  }

  return labels;
}
