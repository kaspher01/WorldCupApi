import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from "graphql";
import { TeamType, PlayerType, TeamInputType, PlayerInputType } from "./types";
import { TeamAPI } from "../datasources/team-api";
import { PlayerAPI } from "../datasources/player-api";

const teamAPI = new TeamAPI();
const playerAPI = new PlayerAPI();

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    teams: {
      type: new GraphQLList(TeamType),
      args: {
        skip: { type: GraphQLInt },
        take: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return teamAPI.getTeams(args);
      },
    },
    team: {
      type: TeamType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return teamAPI.getTeamById(args.id);
      },
    },
    teamsByGroup: {
      type: new GraphQLList(TeamType),
      args: { group: { type: GraphQLString } },
      resolve(parent, args) {
        return teamAPI.getTeamsByGroup(args.group);
      },
    },
    players: {
      type: new GraphQLList(PlayerType),
      args: {
        skip: { type: GraphQLInt },
        take: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return playerAPI.getPlayers(args);
      },
    },
    player: {
      type: PlayerType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return playerAPI.getPlayerById(args.id);
      },
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addTeam: {
      type: TeamType,
      args: {
        name: { type: GraphQLString },
        group: { type: GraphQLString },
      },
      resolve(parent, args) {
        return teamAPI.createTeam(args);
      },
    },
    updateTeam: {
      type: TeamType,
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        group: { type: GraphQLString },
      },
      resolve(parent, args) {
        const { id, ...input } = args;
        return teamAPI.updateTeam(id, input);
      },
    },
    deleteTeam: {
      type: GraphQLBoolean,
      args: {
        id: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return teamAPI.deleteTeam(args.id);
      },
    },
    addPlayer: {
      type: PlayerType,
      args: {
        teamId: { type: GraphQLInt },
        name: { type: GraphQLString },
        position: { type: GraphQLString },
        age: { type: GraphQLInt },
        club: { type: GraphQLString },
      },
      resolve(parent, args) {
        const { teamId, ...playerData } = args;
        return playerAPI.createPlayer(teamId, playerData);
      },
    },
    updatePlayer: {
      type: PlayerType,
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        position: { type: GraphQLString },
        age: { type: GraphQLInt },
        club: { type: GraphQLString },
      },
      resolve(parent, args) {
        const { id, ...input } = args;
        return playerAPI.updatePlayer(id, input);
      },
    },
    deletePlayer: {
      type: GraphQLBoolean,
      args: {
        id: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return playerAPI.deletePlayer(args.id);
      },
    },
    transferPlayer: {
      type: PlayerType,
      args: {
        playerId: { type: GraphQLInt },
        newTeamId: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return playerAPI.transferPlayer(args.playerId, args.newTeamId);
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
