import * as https from "https";
import { token } from ".";
import { OWNER, REPO, SEARCH_QUERY, TO_COLOR } from "./config";
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

  console.log(labelsResponse);

  for (const label of labelsResponse as Label[]) {
    if (label.name.includes(SEARCH_QUERY)) {
      await updateLabel(label.name, TO_COLOR);
    }
  }
}

interface Label {
  id: 4909753686;
  node_id: "LA_kwDOF4fVBs8AAAABJKTlVg";
  url: "https://api.github.com/repos/ubiquity/ubiquity-dollar/labels/Price:%20300%20USDC";
  name: "Price: 300 USDC";
  color: "ededed";
  default: false;
  description: null;
}
