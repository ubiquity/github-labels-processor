import * as https from 'https';
import { owner, repo, token } from '.';

export async function updateLabel(label: string, color: string) {
  return new Promise<void>((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${owner}/${repo}/labels/${encodeURIComponent(label)}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'MyApp/1.0.0',
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Request failed with status code ${res.statusCode}`));
        console.log(res);
        return;
      }

      res.on('data', () => { });
      res.on('end', () => resolve());
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify({
      color: color,
    }));

    req.end();
  });
}
