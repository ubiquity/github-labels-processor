import { Octokit } from "@octokit/rest";
import { GitHubLabel } from "../github-types";

const octokit = new Octokit();

export default async function getLabels({
  owner,
  repository,
}: {
  owner: string;
  repository: string;
}): Promise<GitHubLabel[]> {
  const labelsResponse = await octokit.paginate(
    octokit.rest.issues.listLabelsForRepo,
    {
      owner,
      repo: repository,
      per_page: 100,
    }
  );

  return labelsResponse as GitHubLabel[];
}
