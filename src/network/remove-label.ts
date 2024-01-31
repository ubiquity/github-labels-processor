import * as https from "https";
import { Args } from "../cli/cli-args";
import { log } from "../cli/logging";
import { githubToken } from "../utils/get-github-token";

export async function removeLabel(label: string) {
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
      }/labels/${encodeURIComponent(label)}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${githubToken}`,
        "User-Agent": "MyApp/1.0.0",
      },
    };

    const req = https.request(options, res => {
      if (res.statusCode !== 204) {
        reject(new Error(`Request failed with status code ${res.statusCode}`));
        return;
      }

      res.on("data", () => {});
      res.on("end", () => resolve(undefined));
    });

    req.on("error", error => {
      reject(error);
    });

    req.end();
  });
}
