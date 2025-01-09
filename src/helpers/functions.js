// Encode players into human-readable string
const encodePlayers = (players) => 
  players.map((player) => `${player.user}:${player.mode}`).join(',');

// Decode string back into a players array
const decodePlayers = (param) => 
  param.split(',').map((entry) => {
    const [user, mode] = entry.split(':');
    return { user, mode };
  });

export {
  encodePlayers,
  decodePlayers,
}