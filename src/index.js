import express, { json } from 'express';
import registerRoutes from './routes/routesManager.js';

const app = express();
const PORT = 3000;

app.use(json());

registerRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
