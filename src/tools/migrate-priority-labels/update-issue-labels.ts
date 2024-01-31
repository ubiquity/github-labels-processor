import { Args } from "../../cli/cli-args";
import { log } from "../../cli/logging";
import { GitHubLabel } from "../../github-types";
import { octokit } from "../../utils/get-github-token";

export async function updateIssueLabels(oldLabel: string, newLabel: string) {
  // Fetch all issues with the old label
  const issues = await octokit.rest.issues.listForRepo({
    owner: Args.owner,
    repo: Args.repository,
    labels: oldLabel,
  });

  // Update each issue to have the new label
  for (const issue of issues.data) {
    const labels = (issue.labels as GitHubLabel[]).map(label =>
      label.name === oldLabel ? newLabel : label.name
    );
    log.info(
      `Updating labels for issue number ${issue.number} from ${oldLabel} to ${newLabel}`
    );
    if (Args.execute) {
      await octokit.rest.issues.update({
        owner: Args.owner,
        repo: Args.repository,
        issue_number: issue.number,
        labels,
      });
    } else {
      log.info("dry run, not updating issue labels. Use `--execute` to run.");
    }
    log.ok(`Successfully updated labels for issue number ${issue.number}`);
  }
}
