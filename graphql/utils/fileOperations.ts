import fs from "fs/promises";
import path from "path";
import { WorldCupData } from "../types/worldcup";

const dataPath = path.join(
  process.cwd(),
  "src",
  "graphql",
  "data",
  "worldcup.json"
);

export async function saveData(data: WorldCupData) {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving data:", error);
    throw new Error("Failed to save data");
  }
}

export async function readData(): Promise<WorldCupData> {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    throw new Error("Failed to read data");
  }
}
