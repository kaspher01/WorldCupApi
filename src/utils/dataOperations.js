import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = join(__dirname, '..', 'data', 'worldcup.json');

export const getData = () => {
  const data = readFileSync(dataPath);
  return JSON.parse(data);
};

export const writeData = (data) => {
  writeFileSync(dataPath, JSON.stringify(data, null, 2));
};
