import { Label } from "../network/label";
import { Octokit } from "@octokit/rest";

import { githubToken } from "../utils/get-github-token";
import { log } from "../cli/logging";

export default async function _toggleLabel(args: {
  owner: string;
  repository: string;
  execute?: boolean;
  value?: string;
}) {
  if (!args.value) {
    log.error("No value provided for label to toggle");
    return;
  }

  const labelToToggle = args.value;

  const octokit = new Octokit({ auth: githubToken });

  try {
    const issues = await octokit.paginate(octokit.issues.listForRepo, {
      owner: args.owner,
      repo: args.repository,
      state: "open",
    });

    for (const issue of issues) {
      const currentLabels = issue.labels.map(label => label.name);

      let updatedLabels;

      if (currentLabels.includes(labelToToggle)) {
        updatedLabels = currentLabels.filter(label => label !== labelToToggle);
      } else {
        updatedLabels = [...currentLabels, labelToToggle];
      }

      await octokit.issues.update({
        owner: args.owner,
        repo: args.repository,
        issue_number: issue.number,
        labels: updatedLabels,
      });

      console.log(`Toggled label on issue #${issue.number}`);
    }
  } catch (error) {
    console.error("Error toggling label:", error);
  }
}
