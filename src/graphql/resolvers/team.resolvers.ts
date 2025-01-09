import { TeamAPI } from "../datasources/team-api";

const teamAPI = new TeamAPI();

export const teamResolvers = {
  Query: {
    teams: async (_, { skip, take }) => {
      return await teamAPI.getTeams({ skip, take });
    },
    team: async (_, { id }) => {
      return await teamAPI.getTeamById(id);
    },
    teamsByGroup: async (_, { group }) => {
      return await teamAPI.getTeamsByGroup(group);
    },
  },
  Team: {
    players: (team) => {
      return team.players;
    },
  },
};
