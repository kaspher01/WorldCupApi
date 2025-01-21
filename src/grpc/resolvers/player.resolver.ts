import { loadWorldCupData, saveWorldCupData } from "../utils/data";
import { filterData, sortData, paginateData } from "../utils/filters";

export class PlayerResolver {
  private data: any;

  constructor() {
    this.data = loadWorldCupData();
  }

  async getPlayers(call: any) {
    const { teamId, pagination, filters, sort } = call.request;
    let players: any[] = [];

    for (const worldCup of this.data.WorldCups) {
      const team = worldCup.teams.find((t: any) => t.id === teamId);
      if (team) {
        players = team.players;
        break;
      }
    }

    if (filters) {
      players = filterData(players, filters);
    }

    if (sort) {
      players = sortData(players, sort);
    }

    if (pagination) {
      const { items, totalCount } = paginateData(players, pagination);
      return { players: items, totalCount };
    }

    return { players, totalCount: players.length };
  }

  async getPlayerById(call: any) {
    const { id } = call.request;
    for (const worldCup of this.data.WorldCups) {
      for (const team of worldCup.teams) {
        const player = team.players.find((p: any) => p.id === id);
        if (player) return player;
      }
    }
    throw new Error("Player not found");
  }

  async createPlayer(call: any) {
    const { team_id, name, position, age, club } = call.request;

    let targetTeam = null;
    let targetWorldCupIndex = -1;
    let targetTeamIndex = -1;

    for (let wcIndex = 0; wcIndex < this.data.WorldCups.length; wcIndex++) {
      const teamIndex = this.data.WorldCups[wcIndex].teams.findIndex(
        (t: any) => t.id === team_id
      );
      if (teamIndex !== -1) {
        targetTeam = this.data.WorldCups[wcIndex].teams[teamIndex];
        targetWorldCupIndex = wcIndex;
        targetTeamIndex = teamIndex;
        break;
      }
    }

    if (!targetTeam) {
      throw new Error("Team not found");
    }

    const maxId = Math.max(
      0,
      ...this.data.WorldCups.flatMap((wc: any) =>
        wc.teams.flatMap((t: any) => t.players.map((p: any) => p.id))
      )
    );

    const newPlayer = {
      id: maxId + 1,
      name,
      position,
      age,
      club,
    };

    this.data.WorldCups[targetWorldCupIndex].teams[
      targetTeamIndex
    ].players.push(newPlayer);

    saveWorldCupData(this.data);

    return newPlayer;
  }
}
