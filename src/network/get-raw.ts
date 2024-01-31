import * as https from "https";
import { githubToken } from "../utils/get-github-token";

export async function getGitHubRaw(path: string) {
  return await new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      port: 443,
      path: path,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${githubToken}`,
        "User-Agent": "MyApp/1.0.0",
      },
    };

    const request = https
      .get(options, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Request failed with status code ${res.statusCode}`));
          return;
        }

        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(res));
      })
      .on("error", reject);

    request.on("error", console.error);
    request.end();
  });
}
