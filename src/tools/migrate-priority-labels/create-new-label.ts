import { ARGS } from "../../cli/cli-args";
import { log } from "../../cli/logging";
import { octokit } from "../../utils/get-github-token";

export async function createNewLabel(labelExists: boolean, newLabel: string) {
  if (ARGS.execute) {
    if (!labelExists) {
      await octokit.rest.issues.createLabel({
        owner: ARGS.owner,
        repo: ARGS.repository,
        name: newLabel,
        color: "efefef",
      });
    } else {
      log.info(`Label ${newLabel} already exists in the repository. Skipping creation.`);
    }
  } else {
    log.info("dry run, not creating labels. Use `--execute` to run.");
  }
}
