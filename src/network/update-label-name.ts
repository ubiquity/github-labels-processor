import { Args } from "../cli/cli-args";
import { log } from "../cli/logging";
import { octokit } from "../utils/get-github-token";

export async function updateLabelName(fromName: string, toName: string) {
  if (!Args.execute) {
    log.info("dry run, not deleting labels. Use `--execute` to delete labels");
    return;
  }

  try {
    const response = await octokit.rest.issues.updateLabel({
      owner: Args.owner,
      repo: Args.repository,
      current_name: fromName,
      name: toName,
    });

    if (response.status !== 200) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    return response;
  } catch (error) {
    if ((error as Response).status === 404) {
      throw new Error(`Label ${fromName} not found`);
    }

    throw error;
  }
}
