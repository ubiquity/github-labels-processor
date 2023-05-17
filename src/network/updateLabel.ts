import { IncomingMessage, ServerResponse } from "http";
import * as https from "https";
import { githubToken } from "../utils/get-github-token";
import { Label } from "./label";

interface LabelLike extends Partial<Label> {}

export async function updateLabel(
  home: { owner: string; repository: string },
  labelName: string,
  labelNew: LabelLike
): Promise<IncomingMessage> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      port: 443,
      path: `/repos/${home.owner}/${
        home.repository
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
        reject(new Error(`Request failed with status code ${res.statusCode}`));
        return;
      }

      res.on("data", () => {});
      res.on("end", () => resolve(res));
    });

    req.on("error", error => {
      reject(error);
    });

    req.write(JSON.stringify(labelNew as LabelLike));

    req.end();
  });
}
