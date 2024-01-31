import { Endpoints } from "@octokit/types";

export type GitHubIssue =
  Endpoints["GET /repos/{owner}/{repo}/issues"]["response"]["data"][0];
export type GitHubComment =
  Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"]["response"]["data"][0];
export type GitHubLabel =
  Endpoints["GET /repos/{owner}/{repo}/labels"]["response"]["data"][0];
