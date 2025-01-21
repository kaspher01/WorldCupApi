import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "../data/worldcup.json");

export function loadWorldCupData() {
  const rawData = fs.readFileSync(DATA_PATH, "utf8");
  return JSON.parse(rawData);
}

export function saveWorldCupData(data: any) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(DATA_PATH, jsonData, "utf8");
}
