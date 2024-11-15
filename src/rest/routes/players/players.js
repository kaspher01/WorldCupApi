import { Router } from 'express';
const router = Router();
import { getData, writeData } from '../../utils/dataOperations.js';
import { checkHeaders } from '../../middleware/headers.js';

router.use(checkHeaders);

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: The Players managing API
 * /api/players:
 *   get:
 *     tags: [Players]
 *     summary: Get all players with distinct names
 *     description: Retrieve a list of all players with unique names across all World Cups.
 *     parameters:
 *       - in: header
 *         name: Accept
 *         schema:
 *           type: string
 *           default: application/json
 *         required: true
 *         description: Must be application/json
 *       - in: header
 *         name: X-Rate-Limit
 *         schema:
 *           type: integer
 *         description: Limit of requests per user
 *       - in: header
 *         name: X-Request-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique request identifier for tracing
 *     responses:
 *       200:
 *         description: Distinct players retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   position:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   club:
 *                     type: string
 *       404:
 *         description: No players found
 * /api/players/{playerId}:
 *   get:
 *     tags: [Players]
 *     summary: Get player by ID for a specific World Cup year
 *     description: Retrieve a specific player by their ID and World Cup year.
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: The year of the World Cup
 *       - in: path
 *         name: playerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the player
 *       - in: header
 *         name: Accept
 *         schema:
 *           type: string
 *         required: true
 *         description: Must be application/json
 *       - in: header
 *         name: X-Rate-Limit
 *         schema:
 *           type: integer
 *         description: Limit of requests per user
 *       - in: header
 *         name: X-Request-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique request identifier for tracing
 *     responses:
 *       200:
 *         description: Player retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 position:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 club:
 *                   type: string
 *       404:
 *         description: Player or World Cup not found
 *   put:
 *     tags: [Players]
 *     summary: Update a player by ID for a specific World Cup year
 *     description: Update a specific player's information by their ID and World Cup year.
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: The year of the World Cup
 *       - in: path
 *         name: playerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the player
 *       - in: header
 *         name: Accept
 *         schema:
 *           type: string
 *         required: true
 *         description: Must be application/json
 *       - in: header
 *         name: X-Rate-Limit
 *         schema:
 *           type: integer
 *         description: Limit of requests per user
 *       - in: header
 *         name: X-Request-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique request identifier for tracing
 *     requestBody:
 *       description: Player data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               age:
 *                 type: integer
 *               club:
 *                 type: string
 *     responses:
 *       200:
 *         description: Player updated successfully
 *       404:
 *         description: Player or World Cup not found
 *   delete:
 *     tags: [Players]
 *     summary: Delete a player by ID for a specific World Cup year
 *     description: Remove a specific player by their ID and World Cup year.
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: The year of the World Cup
 *       - in: path
 *         name: playerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the player
 *       - in: header
 *         name: Accept
 *         schema:
 *           type: string
 *         required: true
 *         description: Must be application/json
 *       - in: header
 *         name: X-Rate-Limit
 *         schema:
 *           type: integer
 *         description: Limit of requests per user
 *       - in: header
 *         name: X-Request-ID
 *         schema:
 *           type: string
 *         description: Unique request identifier for tracing
 *     responses:
 *       200:
 *         description: Player deleted successfully
 *       404:
 *         description: Player or World Cup not found
 */

router.get('/', (req, res) => {
  const data = getData();
  const allPlayers = data.WorldCups.flatMap(wc => wc.teams.flatMap(team => team.players));

  const uniquePlayersMap = new Map();

  allPlayers.forEach(player => {
    if (!uniquePlayersMap.has(player.name)) {
      uniquePlayersMap.set(player.name, player);
    }
  });

  const uniquePlayers = Array.from(uniquePlayersMap.values());

  if (uniquePlayers.length > 0) {
    res.json(uniquePlayers);
  } else {
    res.status(404).json({ message: 'No players found' });
  }
});

router.get('/:playerId', (req, res) => {
  const { playerId } = req.params;
  const { year } = req.query;
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

router.put('/:playerId', (req, res) => {
  const { playerId } = req.params;
  const { year } = req.query;
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

router.delete('/:playerId', (req, res) => {
  const { playerId } = req.params;
  const { year } = req.query;
  const data = getData();
  const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));

  if (worldCup) {
    const team = worldCup.teams.find(t => t.players.some(p => p.id === parseInt(playerId, 10)));
    if (team) {
      team.players = team.players.filter(p => p.id !== parseInt(playerId, 10));
      writeData(data);
      res.status(204).json({ message: 'Player deleted successfully' });
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } else {
    res.status(404).json({ message: 'World Cup not found' });
  }
});

export default router;

