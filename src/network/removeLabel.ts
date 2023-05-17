import * as https from 'https';
import { githubToken } from '../utils/get-github-token';
import { OWNER, REPO } from '../config';

export async function removeLabel(label: string) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${OWNER}/${REPO}/labels/${encodeURIComponent(label)}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${githubToken}`,
        'User-Agent': 'MyApp/1.0.0',
      },
    };

    const req = https.request(options, res => {
      if (res.statusCode !== 204) {
        reject(new Error(`Request failed with status code ${res.statusCode}`));
        return;
      }

      res.on('data', () => {});
      res.on('end', () => resolve(undefined));
    });

    req.on('error', error => {
      reject(error);
    });

    req.end();
  });
}
