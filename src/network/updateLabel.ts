import * as https from "https";
import { token } from "..";
import { OWNER, REPO } from "../config";
import { Label } from "./label";

interface LabelLike extends Partial<Label> {}

export async function updateLabel(label: string, labelLike: LabelLike) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      port: 443,
      path: `/repos/${OWNER}/${REPO}/labels/${encodeURIComponent(label)}`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "MyApp/1.0.0",
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Request failed with status code ${res.statusCode}`));
        return;
      }

      res.on("data", () => {});
      res.on("end", () => resolve(undefined));
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(JSON.stringify(labelLike as LabelLike));

    req.end();
  });
}
