import { Router } from 'express';
const router = Router();
import teamsRouter from './teams/teams.js';
import playersRouter from './players/players.js';
import { getData } from '../utils/dataOperations.js';

router.get('/', (req, res) => {
  const data = getData();

  const worldCupsWithLinks = data.WorldCups.map(worldCup => ({
    year: worldCup.year,
    host: worldCup.host,
    teams: worldCup.teams.map(team => ({
      name: team.name,
      link: `http://localhost:3000/api/teams/${worldCup.year}/${team.id}`
    }))
  }));

  const response = {
    WorldCups: worldCupsWithLinks
  };

  res.json(response);
});

router.use('/teams', teamsRouter);
router.use('/players', playersRouter);

export default router;
