import { PlayerAPI } from "../datasources/player-api";
import { TeamAPI } from "../datasources/team-api";

const playerAPI = new PlayerAPI();
const teamAPI = new TeamAPI();

export const playerResolvers = {
  Query: {
    players: async (_, { skip, take }) => {
      return await playerAPI.getPlayers({ skip, take });
    },
    player: async (_, { id }) => {
      return await playerAPI.getPlayerById(id);
    },
  },
  Player: {
    team: async (player) => {
      const allTeams = await teamAPI.getTeams({});
      return allTeams.find((team) =>
        team.players.some((p) => p.id === player.id)
      );
    },
  },
};
