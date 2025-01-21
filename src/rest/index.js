import express, { json } from "express";
import registerRoutes from "./routes/routesManager.js";

const app = express();

app.use(json());

registerRoutes(app);

export default app;
