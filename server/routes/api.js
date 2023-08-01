'use strict';
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const skills = [
  "Overall","Attack","Defence","Strength",
  "Hitpoints","Ranged","Prayer","Magic","Cooking",
  "Woodcutting","Fletching","Fishing","Firemaking",
  "Crafting","Smithing","Mining","Herblore","Agility",
  "Thieving","Slayer","Farming","Runecrafting","Hunter",
  "Construction"
];
const activities = [
  "League Points","Bounty Hunter - Hunter","Bounty Hunter - Rogue",
  "Bounty Hunter (Legacy) - Hunter", "Bounty Hunter (Legacy) - Rogue",
  "Clue Scrolls (all)","Clue Scrolls (beginner)","Clue Scrolls (easy)",
  "Clue Scrolls (medium)","Clue Scrolls (hard)","Clue Scrolls (elite)",
  "Clue Scrolls (master)","LMS - Rank","PvP Arena - Rank",
  "Soul Wars Zeal","Rifts closed","Abyssal Sire","Alchemical Hydra", "Artio",
  "Barrows Chests","Bryophyta","Callisto", "Cal'varion", "Cerberus","Chambers of Xeric",
  "Chambers of Xeric: Challenge Mode","Chaos Elemental","Chaos Fanatic",
  "Commander Zilyana","Corporeal Beast","Crazy Archaeologist",
  "Dagannoth Prime","Dagannoth Rex","Dagannoth Supreme","Deranged Archaeologist", "Duke Sucellus",
  "General Graardor","Giant Mole","Grotesque Guardians","Hespori","Kalphite Queen",
  "King Black Dragon","Kraken","Kree'Arra","K'ril Tsutsaroth","Mimic","Nex","Nightmare",
  "Phosani's Nightmare","Obor","Phantom Muspah","Sarachnis","Scorpia","Skotizo", "Spindel", "Tempoross","The Gauntlet",
  "The Corrupted Gauntlet","The Leviathan", "The Whisperer", "Theatre of Blood","Theatre of Blood: Hard Mode",
  "Thermonuclear Smoke Devil","Tombs of Amascut","Tombs of Amascut: Expert Mode",
  "TzKal-Zuk","TzTok-Jad","Vardorvis", "Venenatis","Vet'ion","Vorkath","Wintertodt","Zalcano","Zulrah"
];

const allActivities = [...skills, ...activities];

const subTypesMap = {
  "Overall": 'overall',"Attack": 'combat',"Defence": 'combat',"Strength": 'combat',
  "Hitpoints": 'combat',"Ranged": 'combat',"Prayer": 'combat',"Magic": 'combat',
  "Cooking": 'non_combat',"Woodcutting": 'non_combat',"Fletching": 'non_combat',"Fishing": 'non_combat',
  "Firemaking": 'non_combat',"Crafting": 'non_combat',"Smithing": 'non_combat',"Mining": 'non_combat',
  "Herblore": 'non_combat',"Agility": 'non_combat',"Thieving": 'non_combat',"Slayer": 'non_combat',
  "Farming": 'non_combat',"Runecrafting": 'non_combat',"Hunter": 'non_combat',"Construction": 'non_combat',
  "League Points": 'minigame',"Bounty Hunter - Hunter": 'minigame',"Bounty Hunter - Rogue": 'minigame',
  "Bounty Hunter (Legacy) - Hunter": 'minigame', "Bounty Hunter (Legacy) - Rogue": 'minigame',
  "LMS - Rank": 'minigame',"PvP Arena - Rank": 'minigame',
  "Soul Wars Zeal": 'minigame',
  "Clue Scrolls (all)": 'clue',"Clue Scrolls (beginner)": 'clue',"Clue Scrolls (easy)": 'clue',
  "Clue Scrolls (medium)": 'clue',"Clue Scrolls (hard)": 'clue',"Clue Scrolls (elite)": 'clue',
  "Clue Scrolls (master)": 'clue',
  "Rifts closed": 'skill_boss',"Wintertodt": 'skill_boss',"Tempoross": 'skill_boss',"Zalcano": 'skill_boss',
  "Chambers of Xeric": 'raid', "Chambers of Xeric: Challenge Mode": 'raid',
  "Theatre of Blood": 'raid',"Theatre of Blood: Hard Mode": 'raid',
  "Tombs of Amascut": 'raid',"Tombs of Amascut: Expert Mode": 'raid',
  "Abyssal Sire": 'boss',"Alchemical Hydra": 'boss', "Artio": 'boss',
  "Barrows Chests": 'boss',"Bryophyta": 'boss',"Callisto": 'boss', "Cal'varion": 'boss', "Cerberus": 'boss',
  "Chaos Elemental": 'boss',"Chaos Fanatic": 'boss',
  "Commander Zilyana": 'boss',"Corporeal Beast": 'boss',"Crazy Archaeologist": 'boss',
  "Dagannoth Prime": 'boss',"Dagannoth Rex": 'boss',"Dagannoth Supreme": 'boss',
  "Deranged Archaeologist": 'boss', "Duke Sucellus": "boss", "General Graardor": 'boss',"Giant Mole": 'boss',
  "Grotesque Guardians": 'boss',"Hespori": 'boss',"Kalphite Queen": 'boss', "King Black Dragon": 'boss'
  ,"Kraken": 'boss',"Kree'Arra": 'boss',"K'ril Tsutsaroth": 'boss', 
  "Mimic": 'boss',"Nex": 'boss',"Nightmare": 'boss', "Phosani's Nightmare": 'boss',
  "Obor": 'boss',"Phantom Muspah": 'boss',"Sarachnis": 'boss',"Scorpia": 'boss',"Skotizo": 'boss', "Spindel": 'boss',
  "The Gauntlet": 'boss', "The Corrupted Gauntlet": 'boss', "The Leviathan": 'boss', "The Whisperer": 'boss',
  "Thermonuclear Smoke Devil": 'boss', "TzKal-Zuk": 'boss',"TzTok-Jad": 'boss', "Vardorvis": 'boss',
  "Venenatis": 'boss',"Vet'ion": 'boss', "Vorkath": 'boss',"Zulrah": 'boss'
};

const modeMap = {
  Main: 'm=hiscore_oldschool',
  Iron: 'm=hiscore_oldschool_ironman',
  HCIM: 'm=hiscore_oldschool_hardcore_ironman',
  UIM: 'm=hiscore_oldschool_ultimate',
  Deadman: 'm=hiscore_oldschool_deadman',
  Seasonal: 'm=hiscore_oldschool_seasonal',
  Tournament: 'm=hiscore_oldschool_tournament',
  FreshStart: 'm=hiscore_oldschool_fresh_start'
};
const BASE_URL = 'https://secure.runescape.com';

const templeUrls = [
  'https://templeosrs.com/efficiency/pvm.php',
  'https://templeosrs.com/efficiency/pvm.php?ehb=im',
  'https://templeosrs.com/efficiency/misc.php',
];

const formatData = (data) => {
  const dataArr = data.split('\n');
  const cleaned = dataArr.slice(0, dataArr.length - 1);
  const mapped = cleaned.map((skill, idx) => {
    const activity = allActivities[idx];
    let rankMapping = {
      name: activity,
      type: skill.split(',').length === 3? 'Skill': 'Activity',
      subType: subTypesMap[activity],
      rank: skill.split(',').length === 3? (skill.split(',')[0] > 0 ? (skill.split(',')[0]): 0) : (skill.split(',')[0] > 0 ? Number(skill.split(',')[0]): 0),
      level: skill.split(',').length === 3? (skill.split(',')[1] > 0 ? (skill.split(',')[1]): 0) : (skill.split(',')[1] > 0 ? Number(skill.split(',')[1]): 0),
      experience: skill.split(',').length === 3? (skill.split(',')[2] > 0 ? skill.split(',')[2]: 0) : null,
      index: skill.split(',').length === 3? skills.indexOf(activity) : activities.indexOf(activity),
    };

    return rankMapping;
  });

  return mapped;
}

const constructUrl = (mode, playerName) => {
  const FINAL_PATH = 'index_lite.ws?player='

  return `${BASE_URL}/${modeMap[mode]}/${FINAL_PATH}${playerName}`
}

const chunkify = (arr, size) => (
  arr.reduce((resultArray, item, idx) => {
    
    const chunkIdx = Math.floor(idx / size);
    if (!resultArray[chunkIdx]) {
      resultArray[chunkIdx] = [];
    }

    resultArray[chunkIdx].push(item);

    return resultArray;
  }, [])
)

const cheerioParseMode = html => {
  const templeActivityMap = {
    // Temple_Activity_Name: OSRS_API_Activity_Name
    'Chambers of Xeric Challenge Mode': 'Chambers of Xeric: Challenge Mode',
    'KreeArra': "Kree'Arra",
    'Kril Tsutsaroth': "K'ril Tsutsaroth",
    'Theatre of Blood Challenge Mode': 'Theatre of Blood: Hard Mode',
    'Tombs of Amascut Expert': 'Tombs of Amascut: Expert Mode',
    'The Nightmare': 'Nightmare',
    'Vetion': "Vet'ion",
  };
  const otherSkips = [
    'Barrows Chests', 'Bryophyta', 'Crazy Archaeologist',
    'Deranged Archaeologist', 'Mimic', 'Obor', 'Skotizo',
    'Hespori',
  ];
  const $ = cheerio.load(html);
  const table = $('#comp-table > tbody > tr > td');
  const allModes = [];
  table.each((idx, ele) => {
    if (idx % 4 === 0 || idx % 4 === 1) {
      allModes.push($(ele).text());
    }
  })

  const modeMap = chunkify(allModes, 2).map(item => {
    const title = !!templeActivityMap[item[0]]? templeActivityMap[item[0]]: item[0];
    return { [title]: Number(item[1]) }
  }).reduce((obj, item) => (
    {...obj, ...item}
  ), {});

  activities.forEach(activity => {
    const isRaidOrBoss = subTypesMap[activity] === 'raid' || subTypesMap[activity] === 'boss';
    if (!modeMap[activity] && isRaidOrBoss && otherSkips.indexOf(activity) < 0 && otherSkips.indexOf(activity) < 0) {
      modeMap[activity] = 0;
    }
  });

  return modeMap;
}

const cheerioParseMisc = html => {
  const templeActivity = {
    'Clue_all': 'Clue Scrolls (all)',
    'Clue_beginner': 'Clue Scrolls (beginner)',
    'Clue_easy': 'Clue Scrolls (easy)',
    'Clue_medium': 'Clue Scrolls (medium)',
    'Clue_hard': 'Clue Scrolls (hard)',
    'Clue_elite': 'Clue Scrolls (elite)',
    'Clue_master': 'Clue Scrolls (master)',
  }
  const $ = cheerio.load(html);
  const table = $('#comp-table > tbody > tr > td');
  const allMisc = [];
  table.each((idx, ele) => {
    if (idx % 4 === 0) {
      allMisc.push($(ele).find('img').attr('title'));
    }
    if (idx % 4 === 1) {
      allMisc.push($(ele).text());
    }
  })

  const miscMap = chunkify(allMisc, 2).map((item, idx) => {
    const title = !!templeActivity[item[0]]? templeActivity[item[0]]: item[0];
    return { [title]: Number(item[1]) }
  }).reduce((obj, item) => (
    {...obj, ...item}
  ), {})

  return miscMap;
}

const handleScoresResponse = (response, res, name, mode) => {
  const { data, status } = response;
  
  if (status === 200) {
    const formatted = formatData(data);
  
    formatted.push({
      name, mode, type: 'Info'
    });
  
    const allData = {
      status: status,
      data: formatted,
    };
  
    res.send(JSON.stringify(allData));
  } 
}

const handleScoresError = (err, res) => {
  const { response } = err;
  const { status } = response;
  
  if (status === 404) {
    const allData = {
      status: status,
      data: 'Player not found. Try a different username or mode',
    };
  
    res.send(JSON.stringify(allData));
  } else {
    const allData = {
      status: 500,
      data: 'Unknown error encountered',
    };
  
    res.send(JSON.stringify(allData));
  }
}

const handleEhbResponse = (data, res) => {
  const { main, iron, misc } = data;
  const mainEhb = cheerioParseMode(main);
  const ironEhb = cheerioParseMode(iron);
  const miscRates = cheerioParseMisc(misc);

  const allData = {
    status: 200,
    data: {
      mainEhb,
      ironEhb,
      miscRates,
    },
  };

  res.send(JSON.stringify(allData));
}

const handleEhbError = (err, res) => {
  const { response } = err;

  res.send(JSON.stringify({
      status: response.status,
      data: response,
    }
  ));
}

router.route('/scores')
  .post((req, res) => {

    const { body } = req;
    const { mode, name } = body;
    const url = constructUrl(mode, name);
    
    axios.get(url)
      .then(response => {
        handleScoresResponse(response, res, name, mode);
      })
      .catch(err => {
        handleScoresError(err, res);
      });
  });

router.route('/ehb')
  .get((req, res) => {
    Promise.all(templeUrls.map(url => axios.get(url)))
      .then(([{data: main}, {data: iron}, {data: misc}]) => {
        handleEhbResponse({main, iron, misc}, res);
      })
      .catch(err => {
        handleEhbError(err, res);
      });
  });

module.exports = router;