import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env');
const envText = readFileSync(envPath, 'utf8');
const match = envText.match(/VITE_WEB3FORMS_ACCESS_KEY=(?:"([^"]+)"|(\S+))/);
const accessKey = (match?.[1] || match?.[2] || '').trim();
if (!accessKey) {
  console.error('No VITE_WEB3FORMS_ACCESS_KEY in .env');
  process.exit(1);
}

const res = await fetch('https://api.web3forms.com/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({
    access_key: accessKey,
    subject: 'Test from Foodie Lab script',
    name: 'Test User',
    email: 'test@example.com',
    message: 'Web3Forms connectivity test ORD-TEST',
    to_email: 'daniyalqais6@gmail.com',
  }),
});

console.log('status', res.status);
const data = await res.json();
console.log(JSON.stringify(data, null, 2));
