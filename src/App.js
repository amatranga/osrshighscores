import React, { useState, useEffect, useContext } from 'react';
import { Container } from '@mui/material';
import Header from './components/Header.jsx';
import SearchBox from './components/SearchBox.jsx';
import DataTables from './components/DataTables.jsx';
import ErrorMessages from './components/ErrorMessages.jsx';
import ShownItemsToggle from './components/ShownItemsToggle.jsx';
import Favorites from './components/Favorites.jsx';
import { ThemeContext } from './contexts/ThemeContext.jsx';
import { getHiScoreByMode } from './api/api.js';
import { ACTIVITY_END_INDEX } from './helpers/constants.js';

const App = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const [playersData, setPlayersData] = useState([]);
  const [visualizationData, setVisualizationData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [errors, setErrors] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('osrs_highscores_favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [shownTables, setShownTables] = useState({
    skillsTable: true,
    skillsChart: true,
    activitiesTable: true,
    bossesTable: true,
  });
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    localStorage.setItem('osrs_highscores_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (playersData.length > 0) {
      const skillNames = playersData[0]?.data?.skills.map((skill) => skill.name);

      const datasets = playersData.map((player, index) => ({
        label: player.username,
        data: player.data.skills.map((skill) => skill.xp),
        backgroundColor: `rgba(${(index + 1) * 60}, 149, 237, 0.7)`,
        borderColor: `rgba(${(index + 1) * 60}, 149, 237, 1)`,
        borderWidth: 1,
      }));

      const axisColors = {
        label: darkMode ? '#fff' : '#000',
        grid: darkMode ? '#444' : '#ddd',
      };

      const data = {
        labels: skillNames,
        datasets,
      };

      const options = {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Skills',
              font: { size: 14 },
              color: axisColors.label,
            },
            ticks: { color: axisColors.label },
            grid: { color: axisColors.grid },
          },
          y: {
            type: 'logarithmic',
            title: {
              display: true,
              text: 'Experience (XP)',
              font: { size: 14 },
              color: axisColors.label,
            },
            ticks: {
              callback: (value) =>
                value >= 1000000000
                  ? `${(value / 1000000000).toFixed(1)}B`
                  : value >= 1000000
                  ? `${(value / 1000000).toFixed(1)}M`
                  : value >= 1000
                  ? `${Math.round(value / 1000)}K`
                  : `${Math.round(value)}`,
              color: axisColors.label,
            },
            grid: { color: axisColors.grid },
          },
        },
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      };

      setVisualizationData(data);
      setChartOptions(options);
    }
  }, [playersData, darkMode]);

  const findUsers = async (players) => {
    try {
      const dataPromises = players.map(async (player) => {
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
            name: 'Total',
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
        } catch (playerError) {
          const errorObj = {
            id: errors.length,
            message: `Error fetching data for player "${player.user} (${player.mode})": ${playerError}`,
          };
          const errorMessages = [...errors, errorObj];
          setErrors(errorMessages);
          return null;
        }
      });

      const results = await Promise.all(dataPromises);
      const validResults = results.filter((result) => result !== null);

      if (validResults.length === 0) {
        throw new Error('All player data requests failed. No valid results.');
      }

      setPlayersData(prevData => {
        const existingUsers = prevData.map(player => player.username);
        const newPlayers = validResults.filter(
          player => !existingUsers.includes(player.username)
        );
        return [...prevData, ...newPlayers];
      })
    } catch (error) {
      const errorObj = {
        id: errors.length,
        message: error.message,
      };
      const errorMessages = [...errors, errorObj];
      setErrors(errorMessages);
    }
  };

  const addPlayerToSearchBox = (player) => {
    const { user, mode } = player;

    setPlayers(prevPlayers => {
      const existing = prevPlayers.some(
        existingPlayer => 
          existingPlayer.user === user && existingPlayer.mode === mode
      );

      if (!existing) {
        return [...prevPlayers, { user, mode }];
      }
      return prevPlayers;
    });
  }

  const addFavorite = (player) => {
    if (!favorites.some((fav) => fav.username === player.username)) {
      setFavorites([...favorites, player]);
    }
  };

  const removeFavorite = (username) => {
    setFavorites(favorites.filter((fav) => fav.username !== username));
  };

  const isFavorite = (username) => {
    return favorites.some((fav) => fav.username === username);
  };

  const toggleTableVisibility = (key) => {
    setShownTables((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const removePlayer = (player) => {
    const { user, mode } = player;
    const selectedPlayers = playersData.filter(element => element.username === user && element.mode === mode);

    if (selectedPlayers && selectedPlayers.length > 0) {
      setPlayersData(prevPlayers => 
        prevPlayers.filter(curPlayer => curPlayer.username !== user || curPlayer.mode !== mode)
      );
      setVisualizationData(prevData => {
        const updatedDatasets = prevData.datasets.filter(
          dataset => dataset.label !== user && dataset.mode !== mode
        );
        
        return { ... prevData, datasets: updatedDatasets };
      });
    }
  }

  return (
    <>
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <Container sx={{ mt: 4 }} disableGutters>

        {errors.length > 0 && <ErrorMessages errors={errors} />}
        
        <SearchBox
          findUsers={findUsers}
          removePlayer={removePlayer}
          players={players}
          setPlayers={setPlayers}
        />

        <Favorites
          favorites={favorites}
          addFavorite={addFavorite}
          isFavorite={isFavorite}
          removeFavorite={removeFavorite}
          findUsers={findUsers}
          addPlayerToSearchBox={addPlayerToSearchBox}
        />

        <ShownItemsToggle
          shownTables={shownTables}
          toggleTableVisibility={toggleTableVisibility}
        />

        {
          playersData.length > 0 &&
          <DataTables
            players={playersData}
            shownTables={shownTables}
            addFavorite={addFavorite}
            isFavorite={isFavorite}
            removeFavorite={removeFavorite}
            visualizationData={visualizationData}
            options={chartOptions}
          />
        }

      </Container>
    </>
  );
};

export default App;
