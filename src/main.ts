import * as https from "https";
import { updateLabel } from "./updateLabel";
import { owner, repo, token } from ".";

export async function main() {
  const labelsResponse = await new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      port: 443,
      path: `/repos/${owner}/${repo}/labels`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "MyApp/1.0.0",
      },
    };

    const request = https
      .get(options, (res) => {
        // if (res.statusCode !== 200) {
        //   reject(
        //     new Error(`Request failed with status code ${res.statusCode}`)
        //   );
        //   return;
        // }

        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
          // process.stdout.write(chunk);
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
    if (label.name.startsWith("Price: ")) {
      await updateLabel(label.name, "00ff00");
    }
  }
}

interface Label {
  id: 4909753686,
  node_id: 'LA_kwDOF4fVBs8AAAABJKTlVg',
  url: 'https://api.github.com/repos/ubiquity/ubiquity-dollar/labels/Price:%20300%20USDC',
  name: 'Price: 300 USDC',
  color: 'ededed',
  default: false,
  description: null
}
