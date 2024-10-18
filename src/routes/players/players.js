import { Router } from 'express';
const router = Router();
import { getData, writeData } from '../../utils/dataOperations.js';


router.get('/:year/:playerId', (req, res) => {
  const { year, playerId } = req.params;
  const data = getData();
  const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));

  if (worldCup) {
    const allPlayers = worldCup.teams.flatMap(team => team.players);
    const player = allPlayers.find(p => p.id === parseInt(playerId, 10));

    if (player) {
      res.json(player);
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } else {
    res.status(404).json({ message: 'World Cup not found' });
  }
});

router.put('/:year/:playerId', (req, res) => {
  const { year, playerId } = req.params;
  const updatedPlayer = req.body;
  const data = getData();
  const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));

  if (worldCup) {
    const team = worldCup.teams.find(t => t.players.some(p => p.id === parseInt(playerId, 10)));
    if (team) {
      const playerIndex = team.players.findIndex(p => p.id === parseInt(playerId, 10));
      team.players[playerIndex] = { ...team.players[playerIndex], ...updatedPlayer };
      writeData(data);
      res.json({ message: 'Player updated successfully', player: team.players[playerIndex] });
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } else {
    res.status(404).json({ message: 'World Cup not found' });
  }
});

router.delete('/:year/:playerId', (req, res) => {
  const { year, playerId } = req.params;
  const data = getData();
  const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));

  if (worldCup) {
    const team = worldCup.teams.find(t => t.players.some(p => p.id === parseInt(playerId, 10)));
    if (team) {
      team.players = team.players.filter(p => p.id !== parseInt(playerId, 10));
      writeData(data);
      res.json({ message: 'Player deleted successfully' });
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } else {
    res.status(404).json({ message: 'World Cup not found' });
  }
});

export default router;
