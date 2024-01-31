import { Args } from "../cli/cli-args";
import { GitHubLabel } from "../github-types";
import { octokit } from "./get-github-token";

export default async function getLabels(): Promise<GitHubLabel[]> {
  const labelsResponse = await octokit.paginate(
    octokit.rest.issues.listLabelsForRepo,
    {
      owner: Args.owner,
      repo: Args.repository,
      per_page: 100,
    }
  );

  return labelsResponse as GitHubLabel[];
}
