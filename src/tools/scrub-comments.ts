import { Label } from "../network/label";
import { Octokit } from "@octokit/rest";

import { githubToken } from "../utils/get-github-token";
import { log } from "../cli/logging";

export default async function _scrubComments(args: {
  owner: string;
  repository: string;
  execute?: boolean;
  value?: string;
}) {
  const { owner, repository, execute, value } = args;
  if (!execute) {
    log.info("dry run, not editing comments. Use `--execute` to run.");
    return;
  }
  const octokit = new Octokit({ auth: githubToken });

  try {
    let page = 1;
    let allIssues = [];

    while (true) {
      // Get all issues (including pull requests) in the repository
      const { data: issues } = await octokit.issues.listForRepo({
        owner,
        repo: repository,
        state: "all",
        per_page: 100, // Adjust the number of results per page as needed
        page,
      });

      if (issues.length === 0) {
        break;
      }

      allIssues = allIssues.concat(issues);
      page++;
    }

    log.info(allIssues.length + " issues found.");

    for (const issue of allIssues) {
      let page = 1;
      let allComments = [];

      while (true) {
        // Get comments for each issue
        const { data: comments } = await octokit.issues.listComments({
          owner,
          repo: repository,
          issue_number: issue.number,
          per_page: 100, // Adjust the number of results per page as needed
          page,
        });

        if (comments.length === 0) {
          break;
        }

        allComments = allComments.concat(comments);
        page++;
      }

      for (const comment of allComments) {
        const newBody = comment.body?.replace(/^\/assign/, "/start");

        if (newBody !== comment.body) {
          // Edit the comment
          await octokit.issues.updateComment({
            owner,
            repo: repository,
            comment_id: comment.id,
            body: newBody,
          });

          log.ok(`Edited comment ${comment.id}, ${comment.html_url}`);
        }
      }
    }

    console.log("Finished editing comments.");
  } catch (error) {
    log.error(error);
  }
}
