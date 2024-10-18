export function teamIdExists(data, teamId) {
  for (const worldCup of data.WorldCups) {
    if (worldCup.teams.some(team => team.id === teamId)) {
      return true;
    }
  }
  return false;
}

export function isPlayerValid(data, newPlayers) {
  for (const newPlayer of newPlayers) {
    for (const worldCup of data.WorldCups) {
      for (const team of worldCup.teams) {
        const existingPlayer = team.players.find(p => p.id === newPlayer.id);
        if (existingPlayer) {
          if (
            existingPlayer.name !== newPlayer.name ||
            existingPlayer.position !== newPlayer.position ||
            existingPlayer.age !== newPlayer.age ||
            existingPlayer.club !== newPlayer.club
          ) {
            return { valid: false, conflictPlayer: existingPlayer, newPlayer };
          }
        }
      }
    }
  }
  return { valid: true };
}
