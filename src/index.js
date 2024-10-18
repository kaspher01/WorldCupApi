import express, { json } from 'express';
import worldCupRoutes from './routes/worldCupRoutes.js';
import swaggerSetup from './config/swagger.js';

const app = express();
const PORT = 3000;

app.use(json());
app.use('/api', worldCupRoutes);

swaggerSetup(app);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
