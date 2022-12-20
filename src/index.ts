import dotenv from "dotenv";
import { getLabels } from "./getLabels";
dotenv.config();
export const token = process.env.GITHUB_TOKEN;
if (token === undefined) {
  throw new Error("GITHUB_TOKEN is not defined");
}

getLabels().catch((error) => {
  console.error(error);
});
