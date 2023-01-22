'use strict';
const express = require('express');
const axios = require('axios');
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
  "Clue Scrolls (all)","Clue Scrolls (beginner)","Clue Scrolls (easy)",
  "Clue Scrolls (medium)","Clue Scrolls (hard)","Clue Scrolls (elite)",
  "Clue Scrolls (master)","LMS - Rank","PvP Arena - Rank",
  "Soul Wars Zeal","Rifts closed","Abyssal Sire","Alchemical Hydra",
  "Barrows Chests","Bryophyta","Callisto","Cerberus","Chambers of Xeric",
  "Chambers of Xeric: Challenge Mode","Chaos Elemental","Chaos Fanatic",
  "Commander Zilyana","Corporeal Beast","Crazy Archaeologist",
  "Dagannoth Prime","Dagannoth Rex","Dagannoth Supreme","Deranged Archaeologist",
  "General Graardor","Giant Mole","Grotesque Guardians","Hespori","Kalphite Queen",
  "King Black Dragon","Kraken","Kree'Arra","K'ril Tsutsaroth","Mimic","Nex","Nightmare",
  "Phosani's Nightmare","Obor","Phantom Muspah","Sarachnis","Scorpia","Skotizo","Tempoross","The Gauntlet",
  "The Corrupted Gauntlet","Theatre of Blood","Theatre of Blood: Hard Mode",
  "Thermonuclear Smoke Devil","Tombs of Amascut","Tombs of Amascut: Expert Mode",
  "TzKal-Zuk","TzTok-Jad","Venenatis","Vet'ion","Vorkath","Wintertodt","Zalcano","Zulrah"
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
  "LMS - Rank": 'minigame',"PvP Arena - Rank": 'minigame',
  "Soul Wars Zeal": 'minigame',"Rifts closed": 'minigame',
  "Clue Scrolls (all)": 'clue',"Clue Scrolls (beginner)": 'clue',"Clue Scrolls (easy)": 'clue',
  "Clue Scrolls (medium)": 'clue',"Clue Scrolls (hard)": 'clue',"Clue Scrolls (elite)": 'clue',
  "Clue Scrolls (master)": 'clue',
  "Chambers of Xeric": 'raid', "Chambers of Xeric: Challenge Mode": 'raid',
  "Theatre of Blood": 'raid',"Theatre of Blood: Hard Mode": 'raid',
  "Tombs of Amascut": 'raid',"Tombs of Amascut: Expert Mode": 'raid',
  "Abyssal Sire": 'boss',"Alchemical Hydra": 'boss',
  "Barrows Chests": 'boss',"Bryophyta": 'boss',"Callisto": 'boss',"Cerberus": 'boss',
  "Chaos Elemental": 'boss',"Chaos Fanatic": 'boss',
  "Commander Zilyana": 'boss',"Corporeal Beast": 'boss',"Crazy Archaeologist": 'boss',
  "Dagannoth Prime": 'boss',"Dagannoth Rex": 'boss',"Dagannoth Supreme": 'boss',
  "Deranged Archaeologist": 'boss', "General Graardor": 'boss',"Giant Mole": 'boss',
  "Grotesque Guardians": 'boss',"Hespori": 'boss',"Kalphite Queen": 'boss', "King Black Dragon": 'boss'
  ,"Kraken": 'boss',"Kree'Arra": 'boss',"K'ril Tsutsaroth": 'boss', 
  "Mimic": 'boss',"Nex": 'boss',"Nightmare": 'boss', "Phosani's Nightmare": 'boss',
  "Obor": 'boss',"Phantom Muspah": 'boss',"Sarachnis": 'boss',"Scorpia": 'boss',"Skotizo": 'boss',"Tempoross": 'boss',
  "The Gauntlet": 'boss', "The Corrupted Gauntlet": 'boss',
  "Thermonuclear Smoke Devil": 'boss', "TzKal-Zuk": 'boss',"TzTok-Jad": 'boss',
  "Venenatis": 'boss',"Vet'ion": 'boss', "Vorkath": 'boss',"Wintertodt": 'boss',
  "Zalcano": 'boss',"Zulrah": 'boss'
};

const formatData = (data) => {
  const dataArr = data.split('\n');
  const cleaned = dataArr.slice(0, dataArr.length - 1);
  const mapped = cleaned.map((skill, idx) => {
    const activity = allActivities[idx];
    let rankMapping = {};
    if (skill.split(',').length === 3) {
      rankMapping.name = activity;
      rankMapping.type = 'Skill';
      rankMapping.rank = skill.split(',')[0] > 0 ? (skill.split(',')[0]): 0;
      rankMapping.level = skill.split(',')[1] > 0 ? (skill.split(',')[1]): 0;
      rankMapping.experience = skill.split(',')[2] > 0 ? skill.split(',')[2]: 0;
      rankMapping.subType = subTypesMap[activity];
    } else {
      rankMapping.name = activity;
      rankMapping.type = 'Activity';
      rankMapping.rank = skill.split(',')[0] > 0 ? Number(skill.split(',')[0]): 0;
      rankMapping.level = skill.split(',')[1] > 0 ? Number(skill.split(',')[1]): 0;
      rankMapping.subType = subTypesMap[activity];
    }

    return rankMapping;
  });

  return mapped;
}

const constructUrl = (mode, playerName) => {
  const BASE_URL = 'https://secure.runescape.com';
  const FINAL_PATH = 'index_lite.ws?player='
  const modeMap = {
    Main: 'm=hiscore_oldschool',
    Iron: 'm=hiscore_oldschool_ironman',
    HCIM: 'm=hiscore_oldschool_hardcore_ironman',
    UIM: 'm=hiscore_oldschool_ultimate',
    Deadman: 'm=hiscore_oldschool_deadman',
    Seasonal: 'm=hiscore_oldschool_seasonal',
    Tournament: 'm=hiscore_oldschool_tournament',
  };

  return `${BASE_URL}/${modeMap[mode]}/${FINAL_PATH}${playerName}`
}

router.route('/scores')
  .post((req, res, next) => {

    const { body } = req;
    const { mode, name } = body;
    const url = constructUrl(mode, name);
    
    axios.get(url)
      .then(response => {
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
      })
      .catch(err => {
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
      });
  });

module.exports = router;