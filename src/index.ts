import dotenv from "dotenv";
import { updateLabel } from "./updateLabel";
import { SEARCH_QUERY_REGEX } from "./config";
import { getLabels, Label } from "./getLabels";
import { removeLabel } from "./removeLabel";
dotenv.config();
export const token = process.env.GITHUB_TOKEN;
if (token === undefined) {
  throw new Error("GITHUB_TOKEN is not defined");
}

getLabels()
  .then(async (labelsResponse) => {
    console.log(labelsResponse);

    for (const label of labelsResponse as Label[]) {
      if (label.name.match(SEARCH_QUERY_REGEX)?.shift()) {
        console.log(`Processing label: ${label.name}`);
        // await removeLabel(label.name);
        // await updateLabel(label.name, {color: "000000"});
        // throw new Error("Not implemented yet");
      }
      // console.trace(`Change the program logic here`);
    }
  })
  .catch((error) => {
    console.error(error);
  });
