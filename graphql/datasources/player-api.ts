import { readData, saveData } from "../utils/fileOperations";
import { applyFilters } from "../utils/filters";
import { FilterOptions } from "../types/common";
import { WorldCupData, Player, Team } from "../types/worldcup";

export class PlayerAPI {
  private players: Player[];
  private worldCupData: WorldCupData;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.worldCupData = await readData();
    this.players = this.worldCupData.WorldCups.flatMap((worldCup) =>
      worldCup.teams.flatMap((team) => team.players)
    );
  }

  async getPlayers({
    filter,
    skip = 0,
    take = 10,
    orderBy = null,
  }: FilterOptions) {
    await this.initialize();

    let filteredPlayers = [...this.players];

    if (filter) {
      filteredPlayers = applyFilters(filteredPlayers, filter);
    }

    if (orderBy) {
      const [field, direction] = orderBy.split("_");
      filteredPlayers.sort((a, b) => {
        if (direction === "DESC") {
          return b[field] - a[field];
        }
        return a[field] - b[field];
      });
    }

    return filteredPlayers.slice(skip, skip + take);
  }

  async getPlayerById(id: number) {
    await this.initialize();
    return this.players.find((player) => player.id === id);
  }

  async createPlayer(teamId: number, input: Omit<Player, "id">) {
    await this.initialize();

    // Znajdź drużynę
    for (const worldCup of this.worldCupData.WorldCups) {
      const team = worldCup.teams.find((t) => t.id === teamId);
      if (team) {
        // Znajdź najwyższe ID wśród wszystkich graczy
        const allPlayers = this.worldCupData.WorldCups.flatMap((wc) =>
          wc.teams.flatMap((t) => t.players)
        );
        const newId = Math.max(...allPlayers.map((p) => p.id)) + 1;

        const newPlayer: Player = {
          id: newId,
          ...input,
        };

        team.players.push(newPlayer);
        await saveData(this.worldCupData);
        await this.initialize();
        return newPlayer;
      }
    }
    throw new Error("Team not found");
  }

  async updatePlayer(id: number, input: Partial<Player>) {
    await this.initialize();

    for (const worldCup of this.worldCupData.WorldCups) {
      for (const team of worldCup.teams) {
        const playerIndex = team.players.findIndex((p) => p.id === id);
        if (playerIndex !== -1) {
          team.players[playerIndex] = {
            ...team.players[playerIndex],
            ...input,
            id, // zachowujemy oryginalne id
          };

          await saveData(this.worldCupData);
          await this.initialize();
          return team.players[playerIndex];
        }
      }
    }
    throw new Error("Player not found");
  }

  async deletePlayer(id: number) {
    await this.initialize();

    for (const worldCup of this.worldCupData.WorldCups) {
      for (const team of worldCup.teams) {
        const playerIndex = team.players.findIndex((p) => p.id === id);
        if (playerIndex !== -1) {
          team.players.splice(playerIndex, 1);
          await saveData(this.worldCupData);
          await this.initialize();
          return true;
        }
      }
    }
    return false;
  }

  async transferPlayer(playerId: number, newTeamId: number) {
    await this.initialize();
    let playerToTransfer: Player | null = null;
    let oldTeam: Team | null = null;

    // Znajdź gracza i jego obecną drużynę
    outerLoop: for (const worldCup of this.worldCupData.WorldCups) {
      for (const team of worldCup.teams) {
        const playerIndex = team.players.findIndex((p) => p.id === playerId);
        if (playerIndex !== -1) {
          playerToTransfer = team.players[playerIndex];
          oldTeam = team;
          team.players.splice(playerIndex, 1);
          break outerLoop;
        }
      }
    }

    if (!playerToTransfer || !oldTeam) {
      throw new Error("Player not found");
    }

    // Znajdź nową drużynę i dodaj do niej gracza
    for (const worldCup of this.worldCupData.WorldCups) {
      const newTeam = worldCup.teams.find((t) => t.id === newTeamId);
      if (newTeam) {
        newTeam.players.push(playerToTransfer);
        await saveData(this.worldCupData);
        await this.initialize();
        return playerToTransfer;
      }
    }

    // Jeśli nie znaleziono nowej drużyny, przywróć gracza do starej
    oldTeam.players.push(playerToTransfer);
    throw new Error("New team not found");
  }
}
