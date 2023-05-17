import dotenv from 'dotenv';
dotenv.config();
export const githubToken = process.env.GITHUB_TOKEN;
if (githubToken === undefined) {
  throw new Error('GITHUB_TOKEN is not defined');
}
