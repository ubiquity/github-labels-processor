import * as https from 'https';
import dotenv from 'dotenv';
// Replace with your personal access token
dotenv.config();
const token = process.env.GITHUB_TOKEN;

// Replace with the owner and repository name
const owner = 'ubiquity';
const repo = 'ubiquity-dollar';

async function updateLabel(label: string, color: string) {
  return new Promise((resolve, reject) => {
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
        return;
      }

      res.on('data', () => {});
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

async function main() {
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

  for (const label of labelsResponse) {
    if (label.name.startsWith('Price: ')) {
      await updateLabel(label.name, '#00ff00');
    }
  }
}

main().catch((error) => {
  console.error(error);
});
