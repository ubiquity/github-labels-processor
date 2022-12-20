import * as https from "https";
import { token } from ".";
import { OWNER, REPO, SEARCH_QUERY_REGEX, TO_COLOR } from "./config";
import { updateLabel } from "./updateLabel";

export async function getLabels() {
  const labelsResponse = await new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      port: 443,
      path: `/repos/${OWNER}/${REPO}/labels?per_page=1000`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "MyApp/1.0.0",
      },
    };

    const request = https
      .get(options, (res) => {
        if (res.statusCode !== 200) {
          reject(
            new Error(`Request failed with status code ${res.statusCode}`)
          );
          return;
        }

        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      })
      .on("error", (error) => {
        reject(error);
      });

    request.on("error", (e) => {
      console.error(e);
    });
    request.end();
  });

  return labelsResponse;
}

export interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: null | string;
}
