import dotenv from "dotenv";
import { updateLabel } from "./updateLabel";
import { SEARCH_QUERY_REGEX, TO_COLOR } from "./config";
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
        // await removeLabel(label.name);
        // await updateLabel(label.name, TO_COLOR);
        throw new Error("Not implemented yet");
      }
    }
  })
  .catch((error) => {
    console.error(error);
  });
