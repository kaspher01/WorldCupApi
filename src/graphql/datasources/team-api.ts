import { readData, saveData } from "../utils/fileOperations";
import { applyFilters } from "../utils/filters";
import { FilterOptions } from "../types/common";
import { WorldCupData, Team } from "../types/worldcup";

export class TeamAPI {
  private teams: Team[];
  private worldCupData: WorldCupData;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.worldCupData = await readData();
    this.teams = this.worldCupData.WorldCups.flatMap(
      (worldCup) => worldCup.teams
    );
  }

  async getTeams({
    filter,
    skip = 0,
    take = 100,
    orderBy = null,
  }: FilterOptions) {
    let filteredTeams = [...this.teams];

    if (filter) {
      filteredTeams = applyFilters(filteredTeams, filter);
    }

    if (orderBy) {
      const [field, direction] = orderBy.split("_");
      filteredTeams.sort((a, b) => {
        if (direction === "DESC") {
          return b[field] - a[field];
        }
        return a[field] - b[field];
      });
    }

    return filteredTeams.slice(skip, skip + take);
  }

  async getTeamById(id: number) {
    return this.teams.find((team) => team.id === id);
  }

  async getTeamsByGroup(group: string) {
    return this.teams.filter((team) => team.group === group);
  }

  async createTeam(input: Omit<Team, "id" | "players">) {
    await this.initialize();
    const newId = Math.max(...this.teams.map((t) => t.id)) + 1;

    const newTeam: Team = {
      id: newId,
      ...input,
      players: [],
    };

    const lastWorldCup =
      this.worldCupData.WorldCups[this.worldCupData.WorldCups.length - 1];
    lastWorldCup.teams.push(newTeam);

    await saveData(this.worldCupData);
    await this.initialize();
    return newTeam;
  }

  async updateTeam(id: number, input: Partial<Team>) {
    await this.initialize();

    for (const worldCup of this.worldCupData.WorldCups) {
      const teamIndex = worldCup.teams.findIndex((t) => t.id === id);
      if (teamIndex !== -1) {
        worldCup.teams[teamIndex] = {
          ...worldCup.teams[teamIndex],
          ...input,
          id,
          players: worldCup.teams[teamIndex].players,
        };

        await saveData(this.worldCupData);
        await this.initialize();
        return worldCup.teams[teamIndex];
      }
    }

    throw new Error("Team not found");
  }

  async deleteTeam(id: number) {
    await this.initialize();

    for (const worldCup of this.worldCupData.WorldCups) {
      const teamIndex = worldCup.teams.findIndex((t) => t.id === id);
      if (teamIndex !== -1) {
        worldCup.teams.splice(teamIndex, 1);
        await saveData(this.worldCupData);
        await this.initialize();
        return true;
      }
    }

    return false;
  }
}
