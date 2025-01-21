import { loadWorldCupData } from "../utils/data";
import { filterData, sortData, paginateData } from "../utils/filters";
import { saveWorldCupData } from "../utils/data";

export class TeamResolver {
  private data: any;

  constructor() {
    this.data = loadWorldCupData();
  }

  async getTeams(call: any) {
    const { worldCupYear, pagination, filters, sort } = call.request;
    const worldCup = this.data.WorldCups.find(
      (wc: any) => wc.year === worldCupYear
    );
    let teams = worldCup ? worldCup.teams : [];

    if (filters) {
      teams = filterData(teams, filters);
    }

    if (sort) {
      teams = sortData(teams, sort);
    }

    if (pagination) {
      const { items, totalCount } = paginateData(teams, pagination);
      return { teams: items, totalCount };
    }

    return { teams, totalCount: teams.length };
  }

  async getTeamById(call: any) {
    const { id } = call.request;
    for (const worldCup of this.data.WorldCups) {
      const team = worldCup.teams.find((t: any) => t.id === id);
      if (team) return team;
    }
    throw new Error("Team not found");
  }

  async createTeam(call: any) {
    const { world_cup_year, name, group } = call.request;

    const worldCupIndex = this.data.WorldCups.findIndex(
      (wc: any) => wc.year === world_cup_year
    );
    if (worldCupIndex === -1) {
      throw new Error("WorldCup not found");
    }

    const maxId = Math.max(
      0,
      ...this.data.WorldCups.flatMap((wc: any) =>
        wc.teams.map((t: any) => t.id)
      )
    );
    const newTeam = {
      id: maxId + 1,
      name,
      group,
      players: [],
    };

    this.data.WorldCups[worldCupIndex].teams.push(newTeam);

    saveWorldCupData(this.data);

    return newTeam;
  }
}
