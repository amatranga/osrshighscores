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
  const { rate } = MODE_MAP[mode];
  const curModeRates = ehbRates[rate] || {};

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

export function yAxisTickformatter(data) {
  const num = Number(data);
  if (num > 1000000000) {
    return (num / 1000000000).toString() + 'B'
  } else if (num > 1000000) {
    return (num / 1000000).toString() + 'M'
  } else if (num > 10000) {
    return (num / 1000).toString() + 'K'
  } else {
    return num.toString();
  }
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

export const MODE_MAP = {
  // Mode_display: { api: 'api_name', rate: 'temple_api_name'}
  'Select Mode': {api: 'Main', rate: 'mainEhb'},
  'Main': {api: 'Main', rate: 'mainEhb'},
  'Ironman': {api: 'Iron', rate: 'ironEhb'},
  'Hard Core Ironman': {api: 'HCIM', rate: 'ironEhb'},
  'Ultimate Ironman': {api: 'UIM', rate: 'ironEhb'},
  'Deadman': {api: 'Deadman', rate: 'ironEhb'},
  'Seasonal': {api: 'Seasonal', rate: 'ironEhb'},
  'Tournament': {api: 'Tournament', rate: 'ironEhb'},
  'Fresh Start': {api: 'FreshStart', rate: 'mainEhb'},
};
