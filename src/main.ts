import * as https from 'https';
import { updateLabel } from './updateLabel';
import { owner, repo, token } from '.';

export async function main() {
  const labelsResponse = await new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${owner}/${repo}/labels`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'MyApp/1.0.0',
      },
    };

    https.get(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Request failed with status code ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (error) => {
      reject(error);
    });
  });

  for (const label of labelsResponse as any) {
    if (label.name.startsWith('Price: ')) {
      await updateLabel(label.name, '#00ff00');
    }
  }
}
