import playersRouter from './players/players.js';
import teamsRouter from './teams/teams.js';
import worldCupsRouter from './worldCups/worldCups.js';
import setupSwagger from '../config/swagger.js';
import {checkHeaders} from '../middleware/headers.js';

const registerRoutes = (app) => {
  setupSwagger(app);

  app.use('/api/players', checkHeaders, playersRouter);
  app.use('/api/teams', checkHeaders, teamsRouter);
  app.use('/api/worldcups', checkHeaders, worldCupsRouter);

  app.get('/', (req, res) => {
    res.send('Welcome to the World Cup API');
  });
};

export default registerRoutes;
