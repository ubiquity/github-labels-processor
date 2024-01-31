import { ARGS } from "../cli/cli-args";
import { log } from "../cli/logging";
import { octokit } from "../utils/get-github-token";
const HTTP_OK = 200;

export async function updateLabelColor(labelName: string) {
  if (!ARGS.execute) {
    log.info("dry run, not deleting labels. Use `--execute` to delete labels");
    return;
  }

  try {
    const response = await octokit.rest.issues.updateLabel({
      owner: ARGS.owner,
      repo: ARGS.repository,
      name: labelName,
      color: ARGS.color,
    });

    const status = response.status;

    if (status !== HTTP_OK) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    return response;
  } catch (error) {
    if ((error as Response).status === 404) {
      throw new Error(`Label ${labelName} not found`);
    }

    throw error;
  }
}
