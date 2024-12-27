import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import {
  Alert,
  Container,
  Grid2 as Grid,
  Stack,
} from '@mui/material';
import Header from './components/Header.jsx';
import SearchBox from './components/SearchBox.jsx';
import XPTable from './components/XPTable.jsx';
import ActivityTable from './components/ActivityTable.jsx';
import BossTable from './components/BossTable.jsx';
import SkillsChart from './components/SkillsChart.jsx';
import ShownItemsToggle from './components/ShownItemsToggle.jsx';
import { getHiScoreByMode } from './api/api.js';
import { ACTIVITY_END_INDEX } from './helpers/constants.js';

const App = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const [playersData, setPlayersData] = useState([]);
  const [visualizationData, setVisualizationData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [errors, setErrors] = useState([]);
  const [shownTables, setShownTables] = useState({
    skillsTable: true,
    skillsChart: true,
    activitiesTable: true,
    bossesTable: true,
  });

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

      setPlayersData(validResults);
    } catch (error) {
      const errorObj = {
        id: errors.length,
        message: error.message,
      };
      const errorMessages = [...errors, errorObj];
      setErrors(errorMessages);
    }
  };

  const toggleTableVisibility = (key) => {
    setShownTables((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <Container sx={{ mt: 4 }} disableGutters>
        {errors.length > 0 && (
          <Stack sx={{ width: '100%' }} spacing={2}>
            {errors.map((error) => (
              <Alert
                key={error.id}
                severity="error"
                onClose={() => setErrors((prev) => prev.filter((e) => e.id !== error.id))}
              >
                {error.message}
              </Alert>
            ))}
          </Stack>
        )}
        <SearchBox findUsers={findUsers} />

        <ShownItemsToggle shownTables={shownTables} toggleTableVisibility={toggleTableVisibility} />

        <Grid container spacing={1}>
          {playersData.length > 0 && shownTables.skillsTable && <XPTable players={playersData} />}
          {playersData.length > 0 && shownTables.activitiesTable && <ActivityTable players={playersData} />}
          {playersData.length > 0 && shownTables.bossesTable && <BossTable players={playersData} />}
          {
            visualizationData.datasets && 
            playersData.length > 0 && 
            shownTables.skillsChart && (
              <SkillsChart data={visualizationData} options={chartOptions} />
          )}
        </Grid>
      </Container>
    </>
  );
};

export default App;
