import { ARGS } from "../cli/cli-args";
import { log } from "../cli/logging";
import { GitHubComment, GitHubIssue } from "../github-types";
import { octokit } from "../utils/get-github-token";

async function fetchAllIssues(owner: string, repository: string) {
  let page = 1;
  let allIssues: GitHubIssue[] = [];
  let hasMoreIssues = true;

  while (hasMoreIssues) {
    const { data: issues } = await octokit.issues.listForRepo({
      owner,
      repo: repository,
      state: "all",
      per_page: 100,
      page,
    });

    if (issues.length === 0) {
      hasMoreIssues = false;
      break;
    }

    allIssues = allIssues.concat(issues);
    page++;
  }

  return allIssues;
}

async function fetchAndEditComments(owner: string, repository: string, issue: GitHubIssue) {
  let comments: GitHubComment[] = [];
  let page = 1;

  do {
    const { data: newComments } = await octokit.issues.listComments({
      owner,
      repo: repository,
      issue_number: issue.number,
      per_page: 100,
      page,
    });

    comments = comments.concat(newComments);
    page++;
  } while (comments.length !== 0);

  for (const comment of comments) {
    const newBody = comment.body?.replace(/^\/assign/, "/start");
    if (!newBody) {
      continue;
    }
    if (newBody !== comment.body) {
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

export default async function scrubCommentsWrapper() {
  const { owner, repository, execute } = ARGS;
  if (!execute) {
    log.info("dry run, not editing comments. Use `--execute` to run.");
    return;
  }

  try {
    const allIssues = await fetchAllIssues(owner, repository);
    log.info(allIssues.length + " issues found.");

    for (const issue of allIssues) {
      await fetchAndEditComments(owner, repository, issue);
    }

    console.log("Finished editing comments.");
  } catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
    } else {
      log.error(JSON.stringify(error));
    }
  }
}
