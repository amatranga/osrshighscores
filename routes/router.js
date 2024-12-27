import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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

router.route('/scores').post(async(requestAnimationFrame, res) => {
  const { mode, name } = requestAnimationFrame.body;

  // Input validation
  if (!mode || typeof mode !== 'string' || !name || typeof name !== 'string') {
    return res.status(400).json({
      status: 400,
      data: 'Invalid input: "mode" and "name" are required fields and must be strings',
    });
  }

  const url = constructUrl(mode, name);

  try {
    const response = await axios.get(url);
    const { data, status } = response;
    const info = {
      username: name,
      mode: mode,
      id: uuidv4(),
    }

    if (status === 200) {
      return res.status(status).json({ status, data, info });
    }
  } catch (error) {
    console.error('Error fetching data from external API: ', error.message);

    if (error.response) {
      // Handle known Axios errors
      const { status } = error.response;
      if (status === 404) {
        const data = 'Player not found. Try a different username or mode';
        return res.status(status).json({ status, data });
      }
    }

    // Handle unknown errors
    const status = 500;
    const data = 'An unknown error occured while fetching data'
    return res.status(status).json({ status, data });
  }
})

export { router };