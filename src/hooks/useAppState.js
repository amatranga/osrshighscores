import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext.jsx";

const useAppState = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [playersData, setPlayersData] = useState([]);
  const [failedPlayers, setFailedPlayers] = useState([]);
  const [visualizationData, setVisualizationData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [errors, setErrors] = useState([]);
  const [shownTables, setShownTables] = useState({
    skillsTable: true,
    skillsChart: true,
    activitiesTable: true,
    bossesTable: true,
  });
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(false);

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
        
        return { ...prevData, datasets: updatedDatasets };
      });
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
  };

  const toggleTableVisibility = (key) => {
    setShownTables((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  return {
    darkMode,
    toggleDarkMode,
    playersData,
    setPlayersData,
    failedPlayers,
    setFailedPlayers,
    visualizationData,
    setVisualizationData,
    chartOptions,
    setChartOptions,
    errors,
    setErrors,
    shownTables,
    setShownTables,
    players,
    setPlayers,
    loading,
    setLoading,
    removePlayer,
    addPlayerToSearchBox,
    toggleTableVisibility,
    searchDisabled,
    setSearchDisabled,
    searchParams,
    setSearchParams,
  };
};

export { useAppState };
