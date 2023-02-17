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

export function calcEhb(ehbRates, mode) {
  const { miscRates } = ehbRates;
  const curMode = modeRateMap[mode];
  const curModeRates = ehbRates[curMode] || {};

  for (let key in miscRates) {
    if (!curModeRates.hasOwnProperty(key)) {
      curModeRates[key] = miscRates[key];
    }
  }
  return curModeRates;
}

export function getEhbByActivity(activity, ehb) {
  const { name, level } = activity;
  if (ehb[name] && ehb[name] > 0 && level > 0) {
    return Math.round(Number(level) / Number(ehb[name]) * 1000) / 1000;
  }
  return '-';
}

export function getEhbTotal(key, ehbRates, playerActivities) {
  const total = playerActivities.reduce((a, b) => {
    if (typeof b[key] === 'number') {
      const res = getEhbByActivity({name: b.name, level: b[key]}, ehbRates);
      if (typeof res === 'number') {
        return a + res;
      }
    }
    return a + 0;
  }, 0);
  return Math.round(total * 1000) / 1000;
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
  {display: 'Skilling Bosses', id: 'skill_boss', type: 'radio'},
  {display: 'Bosses', id: 'boss', type: 'radio'},
  {display: 'Raids', id: 'raid', type: 'radio'},
];

export const tableTypes = [
  {display: 'Total', id: 'total', type: 'radio'},
  {display: 'Net', id: 'net', type: 'radio'},
];

const modeRateMap = {
  'Select Mode': 'mainEhb',
  'Main': 'mainEhb',
  'Ironman': 'ironEhb',
  'Hard Core Ironman': 'ironEhb',
  'Ultimate Ironman': 'ironEhb',
  'Deadman': 'ironEhb',
  'Seasonal': 'ironEhb',
  'Tournament': 'ironEhb',
  'Fresh Start World': 'mainEhb',
};