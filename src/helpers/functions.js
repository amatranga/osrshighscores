import { ACTIVITY_END_INDEX } from "./constants.js";

// Encode players into human-readable string
const encodePlayers = (players) => 
  players.map((player) => `${player.user}:${player.mode}`).join(',');

// Decode string back into a players array
const decodePlayers = (param) => 
  param.split(',').map((entry) => {
    const [user, mode] = entry.split(':');
    return { user, mode };
  });

const download = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export players data to CSV
const exportToCSV = (playersData) => {
  const headers = ['Username', 'Mode', 'Section', 'Name', 'Rank', 'XP/Count'];

  // Flatten playersData to include all sections
  const rows = playersData.flatMap((player) => {
    const { username, mode } = player;
    const { skills, activities } = player.data;
    const allActivities = activities.slice(0, ACTIVITY_END_INDEX);
    const bosses = activities.slice(ACTIVITY_END_INDEX);

    const skillsRows = skills.map((skill) => [
      username,
      mode,
      'Skill',
      skill.name,
      skill.rank,
      skill.xp,
    ]);

    const activitiesRows = allActivities.map((activity) => [
      username,
      mode,
      'Activity',
      activity.name,
      activity.rank,
      activity.score,
    ]);

    const bossRows = bosses.map((boss) => [
      username,
      mode,
      'Boss',
      boss.name,
      boss.rank,
      boss.score,
    ]);

    return [
      ...skillsRows,
      ...activitiesRows,
      ...bossRows,
    ];
  });
  
  // Comibine headers and rows into CSV content
  const csvContent = [headers, ...rows]
    .map((row) => row.join(','))
    .join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  download(blob, 'osrs_highscores_comparison.csv');
};

// Export players data to JSON
const exportToJSON = (playersData) => {
  const jsonContent = JSON.stringify(playersData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  download(blob, 'osrs_highscores_comparison.json');
}

export {
  encodePlayers,
  decodePlayers,
  exportToCSV,
  exportToJSON,
}