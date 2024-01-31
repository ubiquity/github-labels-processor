import { IncomingMessage } from "http";
import * as https from "https";
import { Args } from "../cli/cli-args";
import { log } from "../cli/logging";
import { GitHubLabel } from "../github-types";
import { githubToken } from "../utils/get-github-token";
interface LabelLike extends Partial<GitHubLabel> {}

export async function updateLabel(labelName: string) {
  if (!Args.execute) {
    log.info("dry run, not deleting labels. Use `--execute` to delete labels");
    return;
  }
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      port: 443,
      path: `/repos/${Args.owner}/${
        Args.repository
      }/labels/${encodeURIComponent(labelName)}`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${githubToken}`,
        "User-Agent": "MyApp/1.0.0",
      },
    };

    const req = https.request(options, res => {
      if (res.statusCode !== 200) {
        if (res.statusCode === 404) {
          reject(new Error(`Label ${labelName} not found`));
          return;
        }

        reject(new Error(`Request failed with status code ${res.statusCode}`));
        return;
      }

      res.on("data", () => {});
      res.on("end", () => resolve(res));
    });

    req.on("error", error => {
      reject(error);
    });

    req.write(JSON.stringify({ color: Args.color } as LabelLike));

    req.end();
  });
}
