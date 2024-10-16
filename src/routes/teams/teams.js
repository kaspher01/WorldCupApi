const express = require('express');
const router = express.Router();
const { getData, writeData } = require('../../utils/dataOperations');

router.get('/:year', (req, res) => {
  const { year } = req.params;
  const data = getData();
  const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));

  if (worldCup) {
    const teamsWithLinks = worldCup.teams.map(team => ({
      id: team.id,
      name: team.name,
      group: team.group,
      link: `http://localhost:3000/api/teams/${year}/${team.id}`,
      players: team.players.map(player => ({
        id: player.id,
        name: player.name,
        link: `http://localhost:3000/api/players/${year}/${player.id}`
      }))
    }));

    res.json({ WorldCup: { year: worldCup.year, host: worldCup.host, teams: teamsWithLinks } });
  } else {
    res.status(404).json({ message: 'World Cup not found' });
  }
});

router.get('/:year/:teamId', (req, res) => {
  const { year, teamId } = req.params;
  const data = getData();
  const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));

  if (worldCup) {
    const team = worldCup.teams.find(t => t.id === parseInt(teamId, 10));

    if (team) {
      const teamWithPlayerLinks = {
        id: team.id,
        name: team.name,
        group: team.group,
        players: team.players.map(player => ({
          id: player.id,
          name: player.name,
          link: `http://localhost:3000/api/players/${year}/${player.id}`
        }))
      };
      res.json(teamWithPlayerLinks);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } else {
    res.status(404).json({ message: 'World Cup not found' });
  }
});

router.post('/:year', (req, res) => {
  const { year } = req.params;
  const newTeam = req.body;
  const data = getData();
  const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));

  if (worldCup) {
    newTeam.id = worldCup.teams.length ? worldCup.teams[worldCup.teams.length - 1].id + 1 : 1;
    worldCup.teams.push(newTeam);
    writeData(data);
    res.status(201).json({ message: 'Team added successfully', team: newTeam });
  } else {
    res.status(404).json({ message: 'World Cup not found' });
  }
});

router.put('/:year/:teamId', (req, res) => {
  const { year, teamId } = req.params;
  const updatedTeam = req.body;
  const data = getData();
  const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));

  if (worldCup) {
    const teamIndex = worldCup.teams.findIndex(t => t.id === parseInt(teamId, 10));

    if (teamIndex !== -1) {
      worldCup.teams[teamIndex] = { ...worldCup.teams[teamIndex], ...updatedTeam };
      writeData(data);
      res.json({ message: 'Team updated successfully', team: worldCup.teams[teamIndex] });
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } else {
    res.status(404).json({ message: 'World Cup not found' });
  }
});

router.delete('/:year/:teamId', (req, res) => {
  const { year, teamId } = req.params;
  const data = getData();
  const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));

  if (worldCup) {
    const newTeams = worldCup.teams.filter(t => t.id !== parseInt(teamId, 10));

    if (newTeams.length !== worldCup.teams.length) {
      worldCup.teams = newTeams;
      writeData(data);
      res.json({ message: 'Team deleted successfully' });
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } else {
    res.status(404).json({ message: 'World Cup not found' });
  }
});

module.exports = router;
