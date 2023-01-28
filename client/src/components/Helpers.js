export function playerFilter(player, type) {
  return player.filter(ele => (
    ele.type === type
  ));
}

export function calcBarSize(skillsList, divisor) {
  return (30/skillsList.length) * skillsList.length / divisor
}

export function calcChartWidth(skills, min) {
  return skills.length > 1 ? skills.length * 60 : min;
}

export const graphTypes = [
  {display: 'Level Graph', id: 'level', type: 'radio'},
  {display: 'Experience Graph', id: 'experience', type: 'radio'},
];

export const skillSubTypes = [
  {display: 'All Skills', id: 'all', type: 'radio'},
  {display: 'Overall', id: 'overall', type: 'radio'},
  {display: 'Combat Skills', id: 'combat', type: 'radio'},
  {display: 'Non-Combat Skills', id: 'non_combat', type: 'radio'},
];

export const activitySubTypes = [
  {display: 'All', id: 'all', type: 'radio'},
  {display: 'Minigames', id: 'minigame', type: 'radio'},
  {display: 'Clue Scrolls', id: 'clue', type: 'radio'},
  {display: 'Bosses', id: 'boss', type: 'radio'},
  {display: 'Raids', id: 'raid', type: 'radio'},
];

export const tableTypes = [
  {display: 'Total', id: 'total', type: 'radio'},
  {display: 'Net', id: 'net', type: 'radio'},
];