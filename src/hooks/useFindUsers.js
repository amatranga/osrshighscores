import { getHiScoreByMode } from "../api/api.js";
import { ACTIVITY_END_INDEX } from "../helpers/constants.js";

export const useFindUsers = (setErrors, setPlayersData, setLoading, playersData) => {
  const findUsers = async (players) => {
    // Check for newly added players, and filter out players who we already have data for.
    // Jank way to prevent search from being spammed.
    const newPlayersArr = players.filter(player => {
      const playerExists = playersData.some(p => (
        p.username === player.user && p.mode === player.mode
      ));
      if (playerExists) {
        return false;
      }
      return true;
    });

    if (newPlayersArr && newPlayersArr.length > 0) {
      try {
        setLoading(true);
        const dataPromises = newPlayersArr
          .map(async (player) => {
            try {
              const result = await getHiScoreByMode(player.mode, player.user);
  
              if (!result || !result.data || !result.info) {
                throw new Error(`Invalid data structure for player: ${player.user} (${player.mode})`);
              }
  
              const { activities } = result.data;
              const bosses = activities.slice(ACTIVITY_END_INDEX);
              const totalBossKc = bosses.reduce((acc, { score = 0 }) => acc + score, 0);
              const bossTotal = {
                id: 1,
                name: "Total",
                rank: -1,
                score: totalBossKc,
              };
              activities.push(bossTotal);
  
              return {
                username: result.info.username,
                mode: result.info.mode,
                id: result.info.id,
                data: result.data,
              };
            } catch (error) {
              setErrors((prevErrors) => [
                ...prevErrors,
                { message: `Error fetching data for player "${player.user} (${player.mode})": ${error.message}` },
              ]);
              return null;
            }
          });
  
        const results = await Promise.all(dataPromises);
        const validResults = results.filter((result) => result !== null);
  
        if (validResults.length > 0) {
          setPlayersData((prevData) => {
            const existingUsers = prevData.map((player) => player.username);
            const newPlayers = validResults.filter((player) => !existingUsers.includes(player.username));
            return [...prevData, ...newPlayers];
          });
        }
      } catch (error) {
        console.log('Error caught: ', error);
        setErrors((prevErrors) => [
          ...prevErrors,
          { message: `Error: ${error.message}` },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  return { findUsers };
};
