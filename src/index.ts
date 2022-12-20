import dotenv from 'dotenv';
import { main } from './main';
// Replace with your personal access token
dotenv.config();
export const token = process.env.GITHUB_TOKEN;
if(token === undefined) {
  throw new Error('GITHUB_TOKEN is not defined');
}
// Replace with the owner and repository name
export const owner = 'ubiquity';
export const repo = 'ubiquity-dollar';

main().catch((error) => {
  console.error(error);
});
