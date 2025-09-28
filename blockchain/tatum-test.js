import dotenv from 'dotenv';

// For Node.js 18+, fetch is built-in. For older versions, install node-fetch and use:
// import fetch from 'node-fetch';

dotenv.config();

async function main() {
  const response = await fetch('https://api.tatum.io/v3/polygon/wallet', {
    headers: {
      'x-api-key': process.env.TATUM_API_KEY
    }
  });
  const wallet = await response.json();
  console.log('Polygon wallet:', wallet);
}

main().catch(console.error);
