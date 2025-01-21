import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { WorldCupResolver } from "./resolvers/worldcup.resolver";
import { TeamResolver } from "./resolvers/team.resolver";
import { PlayerResolver } from "./resolvers/player.resolver";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const startGrpcServer = (app: any, port: number) => {
  const worldCupPackageDefinition = protoLoader.loadSync(
    path.join(__dirname, "proto", "worldcup.proto")
  );
  const teamsPackageDefinition = protoLoader.loadSync(
    path.join(__dirname, "proto", "team.proto")
  );
  const playersPackageDefinition = protoLoader.loadSync(
    path.join(__dirname, "proto", "player.proto")
  );

  const worldCupProto = grpc.loadPackageDefinition(
    worldCupPackageDefinition
  ) as any;
  const teamsProto = grpc.loadPackageDefinition(teamsPackageDefinition) as any;
  const playersProto = grpc.loadPackageDefinition(
    playersPackageDefinition
  ) as any;

  const server = new grpc.Server();

  const worldCupResolver = new WorldCupResolver();
  const teamResolver = new TeamResolver();
  const playerResolver = new PlayerResolver();

  server.addService(
    worldCupProto.worldcup.WorldCupService.service,
    worldCupResolver as unknown as grpc.UntypedServiceImplementation
  );
  server.addService(
    teamsProto.worldcup.TeamService.service,
    teamResolver as unknown as grpc.UntypedServiceImplementation
  );
  server.addService(
    playersProto.worldcup.PlayerService.service,
    playerResolver as unknown as grpc.UntypedServiceImplementation
  );

  app.use("/grpc", (req: any, res: any, next: any) => {
    server.bindAsync(
      "localhost:4001",
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          console.error("Failed to start gRPC server:", error);
          return;
        }
        console.log(`gRPC server running on port ${port}`);
      }
    );
    next();
  });

  return server;
};
