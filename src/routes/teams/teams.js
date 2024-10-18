import { Router } from 'express';
const router = Router();
import { getData, writeData } from '../../utils/dataOperations.js';

/**
 * @swagger
 * /api/teams:
 *   get:
 *     tags:
 *       - Teams
 *     summary: Get all teams or teams for a specific year
 *     description: Retrieve all teams or teams from a specific World Cup year.
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: The year of the World Cup to filter teams
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
 *                   _links:
 *                     type: object
 *                     properties:
 *                       self:
 *                         type: string
 *                       players:
 *                         type: string
 *       404:
 *         description: No teams found for the specified year
 */
router.get('/', (req, res) => {
  const { year } = req.query;
  const data = getData();

  if (year) {
    const worldCup = data.WorldCups.find(wc => wc.year === parseInt(year, 10));
    if (worldCup) {
      const teamsWithLinks = worldCup.teams.map(team => ({
        id: team.id,
        name: team.name,
        group: team.group,
        _links: {
          self: `http://localhost:3000/api/teams/${team.id}`,
          players: `http://localhost:3000/api/teams/${team.id}/players`
        }
      }));
      res.json(teamsWithLinks);
    } else {
      res.status(404).json({ message: 'No teams found for the specified year' });
    }
  } else {
    const allTeams = data.WorldCups.flatMap(wc => wc.teams.map(team => ({
      id: team.id,
      name: team.name,
      group: team.group,
      _links: {
        self: `http://localhost:3000/api/teams/${team.id}`,
        players: `http://localhost:3000/api/teams/${team.id}/players`
      }
    })));
    res.json(allTeams);
  }
});

/**
 * @swagger
 * /api/teams/{teamId}:
 *   get:
 *     tags:
 *       - Teams
 *     summary: Get team by ID
 *     description: Retrieve a specific team by its ID.
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the team
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
 *                 _links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       type: string
 *                     players:
 *                       type: string
 *       404:
 *         description: Team not found
 */
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
      _links: {
        self: `http://localhost:3000/api/teams/${team.id}`,
        players: `http://localhost:3000/api/teams/${team.id}/players`
      }
    };
    res.json(teamWithLinks);
  } else {
    res.status(404).json({ message: 'Team not found' });
  }
});

/**
 * @swagger
 * /api/teams/{teamId}/players:
 *   get:
 *     tags:
 *       - Players
 *     summary: Get players for a team by team ID
 *     description: Retrieve players for a specific team by team ID.
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the team
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
 *                   _links:
 *                     type: object
 *                     properties:
 *                       self:
 *                         type: string
 *       404:
 *         description: Team or players not found
 */
router.get('/:teamId/players', (req, res) => {
  const { teamId } = req.params;
  const data = getData();
  const allTeams = data.WorldCups.flatMap(wc => wc.teams);
  const team = allTeams.find(t => t.id === parseInt(teamId, 10));

  if (team) {
    const playersWithLinks = team.players.map(player => ({
      id: player.id,
      name: player.name,
      _links: {
        self: `http://localhost:3000/api/players/${player.id}`
      }
    }));
    res.json(playersWithLinks);
  } else {
    res.status(404).json({ message: 'Team not found' });
  }
});

/**
 * @swagger
 * /api/teams/{teamId}:
 *   put:
 *     tags:
 *       - Teams
 *     summary: Update a team by ID
 *     description: Update the details of a specific team by its ID.
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the team
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
 *     responses:
 *       200:
 *         description: Team updated successfully
 *       404:
 *         description: Team not found
 */
router.put('/:teamId', (req, res) => {
  const { teamId } = req.params;
  const updatedTeam = req.body;
  const data = getData();
  const allTeams = data.WorldCups.flatMap(wc => wc.teams);
  const teamIndex = allTeams.findIndex(t => t.id === parseInt(teamId, 10));

  if (teamIndex !== -1) {
    allTeams[teamIndex] = { ...allTeams[teamIndex], ...updatedTeam };
    writeData(data);
    res.json({ message: 'Team updated successfully', team: allTeams[teamIndex] });
  } else {
    res.status(404).json({ message: 'Team not found' });
  }
});

/**
 * @swagger
 * /api/teams/{teamId}:
 *   delete:
 *     tags:
 *       - Teams
 *     summary: Delete a team by ID
 *     description: Remove a specific team by its ID.
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the team
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *       404:
 *         description: Team not found
 */
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
