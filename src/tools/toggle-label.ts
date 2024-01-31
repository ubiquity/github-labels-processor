import { Args } from "../cli/cli-args";
import { log } from "../cli/logging";
import { GitHubLabel } from "../github-types";
import { octokit } from "../utils/get-github-token";

export default async function _toggleLabel() {
  if (!Args.name) {
    log.error("No name provided for label to toggle");
    return;
  }

  const labelToToggle = Args.name;

  try {
    const issues = await octokit.paginate(octokit.issues.listForRepo, {
      owner: Args.owner,
      repo: Args.repository,
      state: "open",
    });

    for (const issue of issues) {
      const currentLabels = (issue.labels as GitHubLabel[]).map((label) => label.name);

      let updatedLabels;

      if (currentLabels.includes(labelToToggle)) {
        updatedLabels = currentLabels.filter((label) => label !== labelToToggle);
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
