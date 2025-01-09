import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

export const PlayerType = new GraphQLObjectType({
  name: "Player",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    position: { type: GraphQLString },
    age: { type: GraphQLInt },
    club: { type: GraphQLString },
    team: { type: TeamType },
  }),
});

export const TeamType = new GraphQLObjectType({
  name: "Team",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    group: { type: GraphQLString },
    players: { type: new GraphQLList(PlayerType) },
  }),
});

export const TeamInputType = new GraphQLInputObjectType({
  name: "TeamInput",
  fields: {
    name: { type: GraphQLString },
    group: { type: GraphQLString },
  },
});

export const PlayerInputType = new GraphQLInputObjectType({
  name: "PlayerInput",
  fields: {
    name: { type: GraphQLString },
    position: { type: GraphQLString },
    age: { type: GraphQLInt },
    club: { type: GraphQLString },
  },
});
