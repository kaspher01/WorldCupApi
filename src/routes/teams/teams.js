import { Router } from 'express';
const router = Router();
import { getData, writeData } from '../../utils/dataOperations.js';
import { teamIdExists, isPlayerValid } from '../../utils/validators.js';
import { checkHeaders } from '../../middleware/headers.js';

router.use(checkHeaders);

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: The Teams managing API
 * /api/teams:
 *   get:
 *     tags: [Teams]
 *     summary: Get all teams or teams for a specific year
 *     description: Retrieve all teams or teams from a specific World Cup year.
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: The year of the World Cup to filter teams
 *       - in: header
 *         name: Content-Type
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
 *         description: Teams retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   group:
 *                     type: string
 *                   players:
 *                     type: string
 *       404:
 *         description: No teams found for the specified year
 *   post:
 *     tags: [Teams]
 *     summary: Create a new team
 *     description: Add a new team to the list.
 *     parameters:
 *       - in: header
 *         name: Content-Type
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
 *       description: Team object to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: integer
 *                 example: 2018
 *               team:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   group:
 *                     type: string
 *                   players:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         position:
 *                           type: string
 *                         age:
 *                           type: integer
 *                         club:
 *                           type: string
 *     responses:
 *       200:
 *         description: Team created successfully
 *       500:
 *         description: Some server error occurred
 *
 * /api/teams/{teamId}:
 *   get:
 *     tags: [Teams]
 *     summary: Get team by ID
 *     description: Retrieve a specific team by its ID.
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the team
 *       - in: header
 *         name: Content-Type
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
 *         description: A team object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 group:
 *                   type: string
 *                 players:
 *                   type: string
 *       404:
 *         description: Team not found
 *   put:
 *     tags: [Teams]
 *     summary: Update a team by ID
 *     description: Update the details of a specific team by its ID.
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the team
 *       - in: header
 *         name: Content-Type
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
 *       description: Updated team object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               group:
 *                 type: string
 *               players:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     position:
 *                       type: string
 *                     age:
 *                       type: integer
 *                     club:
 *                       type: string
 *     responses:
 *       200:
 *         description: Team updated successfully
 *       404:
 *         description: Team not found
 *   delete:
 *     tags: [Teams]
 *     summary: Delete a team by ID
 *     description: Remove a specific team by its ID.
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the team
 *       - in: header
 *         name: Content-Type
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
 *         description: Team deleted successfully
 *       404:
 *         description: Team not found
 *
 * /api/teams/{teamId}/players:
 *   get:
 *     tags: [Teams]
 *     summary: Get players for a team by team ID
 *     description: Retrieve players for a specific team by team ID.
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the team
 *       - in: header
 *         name: Content-Type
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
 *         description: Players for the team
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   players:
 *                     type: string
 *       404:
 *         description: Team or players not found
 */

router.get('/', (req, res) => {
  const { year } = req.query;
  const data = getData();

  if (year) {
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
      res.status(404).json({ message: 'No teams found for the specified year' });
    }
  } else {
    const allTeams = data.WorldCups.flatMap(wc => wc.teams.map(team => ({
      id: team.id,
      name: team.name,
      group: team.group,
      players: `http://localhost:3000/api/teams/${team.id}/players`
    })));
    res.json(allTeams);
  }
});

router.get('/:teamId', (req, res) => {
  const { teamId } = req.params;
  const data = getData();
  const allTeams = data.WorldCups.flatMap(wc => wc.teams);
  const team = allTeams.find(t => t.id === parseInt(teamId, 10));

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
});

router.get('/:teamId/players', (req, res) => {
  const { teamId } = req.params;
  const data = getData();
  const allTeams = data.WorldCups.flatMap(wc => wc.teams);
  const team = allTeams.find(t => t.id === parseInt(teamId, 10));

  if (team) {
    const playersWithLinks = team.players.map(player => ({
      id: player.id,
      name: player.name,
      details: `http://localhost:3000/api/players/${player.id}`
    }));
    res.json(playersWithLinks);
  } else {
    res.status(404).json({ message: 'Team not found' });
  }
});

router.post('/', (req, res) => {
  const { year, team } = req.body;
  const data = getData();

  const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));
  
  if (!worldCup) {
    return res.status(404).json({ message: 'World Cup year not found' });
  }

  if (teamIdExists(data, team.id)) {
    return res.status(400).json({ message: `Team with ID ${team.id} already exists.` });
  }

  const playerValidation = isPlayerValid(data, team.players);

  if (!playerValidation.valid) {
    return res.status(400).json({
      message: `Player with ID ${playerValidation.newPlayer.id} already exists with different data.`,
      existingPlayer: playerValidation.conflictPlayer,
      newPlayer: playerValidation.newPlayer
    });
  }

  worldCup.teams.push(team);
  writeData(data);

  res.json({ message: 'Team added successfully', teamId: team.id });
});

router.put('/:teamId', (req, res) => {
  const { teamId } = req.params;
  const updatedTeam = req.body;
  const data = getData();

  const allTeams = data.WorldCups.flatMap(wc => wc.teams);
  const teamIndex = allTeams.findIndex(t => t.id === parseInt(teamId, 10));

  if (teamIndex === -1) {
    return res.status(404).json({ message: 'Team not found' });
  }

  const playerValidation = isPlayerValid(data, team.players);
  if (!playerValidation.valid) {
    return res.status(400).json({
      message: `Player with ID ${playerValidation.newPlayer.id} already exists with different data.`,
      existingPlayer: playerValidation.conflictPlayer,
      newPlayer: playerValidation.newPlayer
    });
  }

  allTeams[teamIndex] = { ...allTeams[teamIndex], ...updatedTeam };
  writeData(data);

  res.json({ message: 'Team updated successfully', team: allTeams[teamIndex] });
});

router.delete('/:teamId', (req, res) => {
  const { teamId } = req.params;
  const data = getData();
  const allTeams = data.WorldCups.flatMap(wc => wc.teams);
  const newTeams = allTeams.filter(t => t.id !== parseInt(teamId, 10));

  if (newTeams.length !== allTeams.length) {
    writeData(data);
    res.json({ message: 'Team deleted successfully' });
  } else {
    res.status(404).json({ message: 'Team not found' });
  }
});

export default router;
