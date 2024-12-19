import React, {
  useState,
  useEffect,
  useContext,
} from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import {
  Box,
  Container,
  Grid2 as Grid,
} from '@mui/material';
import Header from './components/Header';
import SearchBox from './components/SearchBox';
import XPTable from './components/XPTable';
import ActivityTable from './components/ActivityTable';
import BossTable from './components/BossTable';
import SkillsChart from './components/SkillsChart';
import { getHighScoreByMode } from './api/api';

const App = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const [playerData, setPlayerData] = useState({});
  const [playerSkills, setPlayerSkills] = useState([]);
  const [playerActivities, setPlayerActivities] = useState([]);
  const [playerBosses, setPlayerBosses] = useState([]);
  const [visualizationData, setVisualizationData] = useState([]);
  const [chartOptions, setChartOptions] = useState([]);

  useEffect(() => {
    if (playerData.data) {
      const ACTIVITY_END_INDEX = 18;
      const { skills, activities } = playerData.data;
  
      const otherActivities = activities.slice(0, ACTIVITY_END_INDEX);
      const bosses = activities.slice(ACTIVITY_END_INDEX);

      setPlayerSkills(skills);
      setPlayerActivities(otherActivities);
      setPlayerBosses(bosses);
    }

  }, [playerData]);

  useEffect(() => {
    if (playerSkills && playerSkills.length > 0) {
      const skillNames = playerSkills.map(skill => skill.name);
      const allXPValues = playerSkills.map(skill => skill.xp);
      const barColors = {
        background: darkMode
          ? "rgba(100, 149, 237, 0.7)" // Softer blue for dark mode
          : "rgba(54, 162, 235, 0.6)",
        border: darkMode
          ? "rgba(100, 149, 237, 1)" // Stronger blue in dark mode
          : "rgba(54, 162, 235, 1)",
      };
      const axisColors = {
        label: darkMode ? "#fff" : "#000", // White for dark mode axes
        grid: darkMode ? '#444' : '#ddd',
      }
      const tooltipColors = {
        backgroundColor: darkMode ? '#333' : '#fff',
        titleColor: darkMode ? '#fff' : '#000',
        bodyColor: darkMode ? '#fff' : '#000',
      };

      const data = {
        labels: skillNames,
        datasets: [
          {
            label: 'Player Experience',
            data: allXPValues,
            backgroundColor: barColors.background,
            borderColor: barColors.border,
            borderWidth: 1,
          }
        ]
      };

      const options = {
        scales: {
          x: {
            title: {
              display: true,
              text: "Skills",
              font: { size: 14 },
              color: axisColors.label,
            },
            ticks: {
              color: axisColors.label,
            },
            grid: {
              color: axisColors.grid,
            }
          },
          y: {
            type: "logarithmic", // Logarithmic scaling
            title: {
              display: true,
              text: "Experience (XP)",
              font: { size: 14 },
              color: axisColors.label,
            },
            ticks: {
              callback: (value) => (
                value >= 1000000000
                  ? `${(value / 1000000000).toFixed(1)}B` 
                  : value >= 1000000
                  ? `${(value / 1000000).toFixed(1)}M`
                  : value >= 1000
                  ? `${Math.round(value / 1000)}K`
                  : `${Math.round(value)}`
              ),
              color: axisColors.label,
            },
            grid: {
              color: axisColors.grid,
            },
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: false, // Hide legend since it's self-explanatory
          },
          tooltip: {
            backgroundColor: tooltipColors.backgroundColor,
            titleColor: tooltipColors.titleColor,
            bodyColor: tooltipColors.bodyColor,
            callbacks: {
              label: (context) => (
                `XP: ${context.raw.toLocaleString()}`
              ),
            },
          },
        },
      };

      setVisualizationData(data);
      setChartOptions(options);
    }
  }, [playerSkills, darkMode]);
  
  const findUser = ({user, mode}) => {
    getHighScoreByMode(mode, user).then(res => {
      setPlayerData(res);
    });
  };

  return (
    <>
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <Container sx={{ mt: 4 }} disableGutters>
        <SearchBox onClick={findUser} />
        
        {/* Player data */}
        {playerData.data &&
        <>
          <Grid container spacing={1}>
            <XPTable skills={playerSkills} userInfo={playerData.info} />
            <ActivityTable activities={playerActivities} userInfo={playerData.info} />
            <BossTable bosses={playerBosses} userInfo={playerData.info} />
          </Grid>
        </>
        }
        
        {/* Visualization */}
        {visualizationData.datasets && <Box sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            <SkillsChart data={visualizationData} options={chartOptions} />
          </Grid>
        </Box>}
      </Container>
    </>
  );
};

export default App;
