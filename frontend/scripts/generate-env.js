const fs = require('fs');
const path = require('path');

require('dotenv').config({
  path: fs.existsSync(path.resolve(__dirname, '../.env'))
    ? path.resolve(__dirname, '../.env')
    : path.resolve(__dirname, '../.env.example'),
});

const apiUrl = process.env.API_URL || 'http://localhost:3000';
const apiBasePath = process.env.API_BASE_PATH || '/api';
const production = process.env.NODE_ENV === 'production';

const environmentFile = `// Auto-generated from .env — run "npm start" or "npm run build" to regenerate.
export const environment = {
  production: ${production},
  apiUrl: '${apiUrl}',
  apiBasePath: '${apiBasePath}',
} as const;
`;

const outputPath = path.resolve(__dirname, '../src/environments/environment.ts');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, environmentFile);

console.log('Generated src/environments/environment.ts');
