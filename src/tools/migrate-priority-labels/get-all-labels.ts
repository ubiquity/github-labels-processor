import { ARGS } from "../../cli/cli-args";
import { log } from "../../cli/logging";
import { octokit } from "../../utils/get-github-token";

export async function getAllLabels() {
  // 1. Check if the new label exists
  const { data: labels } = await octokit.rest.issues.listLabelsForRepo({
    owner: ARGS.owner,
    repo: ARGS.repository,
  });

  log.info(`Retrieved ${labels.length} labels from repository ${ARGS.repository}`);

  return labels;
}
