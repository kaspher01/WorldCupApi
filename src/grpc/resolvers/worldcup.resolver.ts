import { loadWorldCupData } from "../utils/data";
import { filterData, sortData, paginateData } from "../utils/filters";
import { saveWorldCupData } from "../utils/data";

export class WorldCupResolver {
  private data: any;

  constructor() {
    this.data = loadWorldCupData();
  }

  async getWorldCups(call: any) {
    const { pagination, filters, sort } = call.request;
    let worldCups = this.data.WorldCups;

    if (filters) {
      worldCups = filterData(worldCups, filters);
    }

    if (sort) {
      worldCups = sortData(worldCups, sort);
    }

    if (pagination) {
      const { items, totalCount } = paginateData(worldCups, pagination);
      return { worldCups: items, totalCount };
    }

    return { worldCups, totalCount: worldCups.length };
  }

  async getWorldCupByYear(call: any) {
    const { year } = call.request;
    const worldCup = this.data.WorldCups.find((wc: any) => wc.year === year);
    if (!worldCup) {
      throw new Error("WorldCup not found");
    }
    return worldCup;
  }

  async createWorldCup(call: any) {
    const { year, host } = call.request;

    const exists = this.data.WorldCups.some((wc: any) => wc.year === year);
    if (exists) {
      throw new Error("WorldCup for this year already exists");
    }

    const newWorldCup = {
      year,
      host,
      teams: [],
    };

    this.data.WorldCups.push(newWorldCup);

    saveWorldCupData(this.data);

    return newWorldCup;
  }
}
