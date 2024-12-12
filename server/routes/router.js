import express from 'express';
import axios from 'axios';

const router = express.Router();

const modeMap = {
  main: 'hiscore_oldschool',
  iron: 'hiscore_oldschool_ironman',
  hcim: 'hiscore_oldschool_hardcore_ironman',
  uim: 'hiscore_oldschool_ultimate',
  deadman: 'hiscore_oldschool_deadman',
  seasonal: 'hiscore_oldschool_seasonal',
  tournament: 'hiscore_oldschool_tournament',
  freshStart: 'hiscore_oldschool_fresh_start',
};
const BASE_URL = 'https://secure.runescape.com/m=';
const FINAL_URL = 'index_lite.json?player=';

const constructUrl = (mode, name) => {
  const selectedMode = modeMap[mode];
  return `${BASE_URL}${selectedMode}/${FINAL_URL}${name}`;
};

router.route('/scores')
  .post((req, res) => {
    const { mode, name } = req.body;
    const url = constructUrl(mode, name);
    const allData = {
      status: '',
      data: '',
    };

    axios.get(url)
      .then(response => {
        const { data, status } = response;
        if (status === 200) {
          allData.status = status;
          allData.data = data;
          res.send(JSON.stringify(allData));
        }
      })
      .catch(error => {
        const { status } = error.response;
        if (status === 404) {
          allData.status = status;
          allData.data = 'Player not found. Try a different username or mode';
        }
        else {
          allData.status = 500;
          allData.data = 'Unknown error encountered';
        }

        res.send(JSON.stringify(allData));
      });
});

export { router };