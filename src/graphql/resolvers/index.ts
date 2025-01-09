import { teamResolvers } from "./team.resolvers";
import { playerResolvers } from "./player.resolvers";

export const resolvers = {
  Query: {
    ...teamResolvers.Query,
    ...playerResolvers.Query,
  },
  Player: {
    ...playerResolvers.Player,
  },
  Team: {
    ...teamResolvers.Team,
  },
};
