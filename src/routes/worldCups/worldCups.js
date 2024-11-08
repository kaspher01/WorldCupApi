import { Router } from 'express';
const router = Router();
import { getData } from '../../utils/dataOperations.js';
import { checkHeaders } from '../../middleware/headers.js';

router.use(checkHeaders);

/**
 * @swagger
 * tags:
 *   name: WorldCups
 *   description: The World Cups managing API
 * /api/worldcups:
 *   get:
 *     tags: [WorldCups]
 *     summary: Get all World Cups
 *     description: Retrieve a list of all World Cups with links to associated teams.
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
 *         description: Unique request identifier for tracing
 *     responses:
 *       200:
 *         description: List of all World Cups with links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   year:
 *                     type: integer
 *                   host:
 *                     type: string
 *                   teams:
 *                     type: string
 *       404:
 *         description: No World Cups found
 * /api/worldcups/{year}:
 *   get:
 *     tags: [WorldCups]
 *     summary: Get World Cup by year
 *     description: Retrieve a specific World Cup by year with links to its teams.
 *     parameters:
 *       - in: path
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: The year of the World Cup
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
 *         description: Unique request identifier for tracing
 *     responses:
 *       200:
 *         description: World Cup details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 year:
 *                   type: integer
 *                 host:
 *                   type: string
 *                 teams:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       group:
 *                         type: string
 *                       players:
 *                         type: string
 *       404:
 *         description: World Cup not found
 */

router.get('/', (req, res) => {
  const data = getData();
  const worldCups = data.WorldCups.map(wc => ({
    year: wc.year,
    host: wc.host,
    teams: `http://localhost:3000/api/worldcups/${wc.year}/teams`
  }));

  if (worldCups.length > 0) {
    res.json(worldCups);
  } else {
    res.status(404).json({ message: 'No World Cups found' });
  }
});

router.get('/:year', (req, res) => {
  const { year } = req.params;
  const data = getData();
  const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));

  if (worldCup) {
    const teamsWithLinks = worldCup.teams.map(team => ({
      id: team.id,
      name: team.name,
      group: team.group,
      players: `http://localhost:3000/api/teams/${team.id}/players`
    }));
    res.json({
      year: worldCup.year,
      host: worldCup.host,
      teams: teamsWithLinks
    });
  } else {
    res.status(404).json({ message: 'World Cup not found' });
  }
});

router.get('/:year/teams', (req, res) => {
  const { year } = req.params;
  const data = getData();
  const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));

  if (worldCup) {
    const teams = worldCup.teams.map(team => ({
      id: team.id,
      name: team.name,
      group: team.group,
      players: `http://localhost:3000/api/teams/${team.id}/players`
    }));
    res.json(teams);
  } else {
    res.status(404).json({ message: 'No teams found for the specified World Cup year' });
  }
});

router.get('/:year/teams/:teamId', (req, res) => {
  const { year, teamId } = req.params;
  const data = getData();
  const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));

  if (worldCup) {
    const team = worldCup.teams.find(t => t.id === parseInt(teamId, 10));
    if (team) {
      const teamWithLinks = {
        id: team.id,
        name: team.name,
        group: team.group,
        players: `http://localhost:3000/api/teams/${team.id}/players`
      };
      res.json(teamWithLinks);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } else {
    res.status(404).json({ message: 'World Cup not found' });
  }
});

export default router;
