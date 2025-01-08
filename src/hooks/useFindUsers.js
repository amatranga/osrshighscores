import { getHiScoreByMode } from "../api/api.js";
import { ACTIVITY_END_INDEX } from "../helpers/constants.js";

export const useFindUsers = (setErrors, setPlayersData, setLoading, playersData, setSearchDisabled) => {
  const findUsers = async (players) => {
    // Retrieve previously searched users from session storage
    // Handles users who were searched for, then removed, then searched for again
    const sessionData = JSON.parse(sessionStorage.getItem('osrs_highscores_searched_users') || "[]");
    const sessionPlayers = sessionData.filter(player => (
      players.every((p) => p.user === player.username && p.mode === player.mode)
    ));

    if (sessionPlayers && sessionPlayers.length > 0) {
      // Filter out invalid session players before setting data
      const validSessionPlayers = sessionPlayers.filter(player => (Object.hasOwn(player, 'data')));
      if (validSessionPlayers && validSessionPlayers.length > 0) {
        const newPlayers = players.filter(player => 
          playersData.some((p) => (
            p.username === player.user && p.mode === player.mode
          ))
        );
        // Prevent same player from being added to page multiple times from 'Favorites' section
        if (newPlayers && newPlayers.length < 1) {
          setPlayersData((prevData) => ([...prevData, ...sessionPlayers]));
        }
      }
      setSearchDisabled(false);
      return;
    }

    // Retrieve users who we already have data for
    // Handles users who already have data displayed in the application
    const newPlayersArr = players.filter(player => (
      !playersData.some(p => (
        p.username === player.user && p.mode === player.mode
      ))
    ));

    // Search for players who don't have data in either session OR application
    if (newPlayersArr && newPlayersArr.length > 0) {
      try {
        setLoading(true);
        const dataPromises = newPlayersArr.map(async (player) => {
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
          // Update playersData state
          setPlayersData((prevData) => {
            const existingUsers = prevData.map((player) => player.username);
            const newPlayers = validResults.filter((player) => !existingUsers.includes(player.username));
            return [...prevData, ...newPlayers];
          });
          // Add newly searched players to session storage
          const updatedSessionData = [...sessionData, ...validResults];
          sessionStorage.setItem('osrs_highscores_searched_users', JSON.stringify(updatedSessionData));
        }
      } catch (error) {
        setErrors((prevErrors) => [
          ...prevErrors,
          { message: `Error: ${error.message}` },
        ]);
      } finally {
        setLoading(false);
        setSearchDisabled(false);
      }
    }

  };

  return { findUsers };
};
