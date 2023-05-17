import { getGitHub } from '../network/get';
import { Label } from '../network/label';

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
