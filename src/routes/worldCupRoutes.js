const express = require('express');
const router = express.Router();
const teamsRouter = require('./teams/teams');
const playersRouter = require('./players/players');
const { getData } = require('../utils/dataOperations');

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

module.exports = router;
