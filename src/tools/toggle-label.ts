import { Octokit } from "@octokit/rest";
import { GitHubLabel } from "../network/label";

import { Args } from "../cli/cli-args";
import { log } from "../cli/logging";
import { githubToken } from "../utils/get-github-token";

export default async function _toggleLabel() {
  if (!Args.name) {
    log.error("No name provided for label to toggle");
    return;
  }

  const labelToToggle = Args.name;

  const octokit = new Octokit({ auth: githubToken });

  try {
    const issues = await octokit.paginate(octokit.issues.listForRepo, {
      owner: Args.owner,
      repo: Args.repository,
      state: "open",
    });

    for (const issue of issues) {
      const currentLabels = (issue.labels as GitHubLabel[]).map(
        label => label.name
      );

      let updatedLabels;

      if (currentLabels.includes(labelToToggle)) {
        updatedLabels = currentLabels.filter(label => label !== labelToToggle);
      } else {
        updatedLabels = [...currentLabels, labelToToggle];
      }

      await octokit.issues.update({
        owner: Args.owner,
        repo: Args.repository,
        issue_number: issue.number,
        labels: updatedLabels,
      });

      console.log(`Toggled label on issue #${issue.number}`);
    }
  } catch (error) {
    console.error("Error toggling label:", error);
  }
}
