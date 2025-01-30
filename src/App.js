import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import Header from './components/Header.jsx';
import SearchBox from './components/SearchBox.jsx';
import DataTables from './components/DataTables.jsx';
import ErrorMessages from './components/ErrorMessages.jsx';
import ShownItemsToggle from './components/ShownItemsToggle.jsx';
import Favorites from './components/Favorites.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ExportButtons from './components/ExportButtons.jsx';
import ActionButtons from './components/ActionButtons.jsx';
import { useAppState } from './hooks/useAppState.js';
import { useActionButtonState } from './hooks/useActionButtonState.js';
import { useFavorites } from './hooks/useFavorites.js';
import { useFindUsers } from './hooks/useFindUsers.js';
import { useMountEffect } from './hooks/useMountEffect.js';
import {
  encodePlayers,
  decodePlayers,
  exportToCSV,
  exportToJSON,
} from './helpers/functions.js';

const App = () => {
  const {
    darkMode,
    toggleDarkMode,
    playersData,
    setPlayersData,
    failedPlayers,
    setFailedPlayers,
    visualizationData,
    chartOptions,
    errors,
    setErrors,
    shownTables,
    players,
    setPlayers,
    loading,
    setLoading,
    removePlayer,
    addPlayerToSearchBox,
    toggleTableVisibility,
    setSearchDisabled,
    searchDisabled,
    searchParams,
    setSearchParams,
  } = useAppState();

  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useFavorites(setPlayers);

  const { findUsers } = useFindUsers(
    setErrors,
    setPlayersData,
    setLoading,
    playersData,
    setSearchDisabled,
    setFailedPlayers,
  );

  const {
    showFavorites,
    setShowFavorites,
    showCharts,
    setShowCharts,
  } = useActionButtonState();

  // Populate state from URL on initial load
  useMountEffect(() => {
    const param = searchParams.get('players');
    if (param) {
      const playersFromUrl = decodePlayers(param);
      setPlayers(playersFromUrl);
      findUsers(playersFromUrl);
    }
  });

  // Update URL whenever `players` changes
  useEffect(() => {
    const validPlayers = players.filter((player) => (
      !failedPlayers.some((failed) => (
        failed.user === player.user && failed.mode === player.mode
      ))
    ));

    // Get the current players from the URL
    const currentPlayersFromUrl = searchParams.get('players');
    const currentEncodedPlayers = currentPlayersFromUrl || '';
    const newEncodedPlayers = encodePlayers(players);
  
    // Only update the URL if the encoded players string has changed
    if (newEncodedPlayers !== currentEncodedPlayers) {
      if (validPlayers.length > 0) {
        setSearchParams({ players: newEncodedPlayers });
      } else {
        setSearchParams({}); // Clear URL if no players
      }
    }
    // eslint-disable-next-line
  }, [players, searchParams, setSearchParams]);

  useEffect(() => {
    if (players.length > 0) {
      const trimmedUsers = players
        .filter((player) => 
          !failedPlayers.some((failed) => 
            failed.user === player.user && failed.mode === player.mode
        ))
        .map(player => (
          {
            user: player.user.trim(),
            mode: player.mode
          }
        ));
      if (trimmedUsers.length > 0) {
        findUsers(trimmedUsers);
      }
    }
  }, [players, findUsers, failedPlayers]);

  return (
    <>
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <Container sx={{ mt: 4 }} disableGutters>

        {errors.length > 0 && <ErrorMessages errors={errors} setErrors={setErrors} />}
        
        <SearchBox
          findUsers={findUsers}
          removePlayer={removePlayer}
          players={players}
          setPlayers={setPlayers}
          setSearchDisabled={setSearchDisabled}
          searchDisabled={searchDisabled}
          failedPlayers={failedPlayers}
          setFailedPlayers={setFailedPlayers}
        />

        <ActionButtons
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          showCharts={showCharts}
          setShowCharts={setShowCharts}
        />

        {showFavorites && (
          <Favorites
            favorites={favorites}
            addFavorite={addFavorite}
            isFavorite={isFavorite}
            removeFavorite={removeFavorite}
            findUsers={findUsers}
            addPlayerToSearchBox={addPlayerToSearchBox}
          />
        )}

        {showCharts && (
          <ShownItemsToggle
            shownTables={shownTables}
            toggleTableVisibility={toggleTableVisibility}
          />
        )}

        {loading && <LoadingSpinner />}

        {
          playersData.length > 0 &&
          <>
            <DataTables
              players={playersData}
              shownTables={shownTables}
              addFavorite={addFavorite}
              isFavorite={isFavorite}
              removeFavorite={removeFavorite}
              visualizationData={visualizationData}
              options={chartOptions}
            />
            <ExportButtons
              exportToCsv={() => exportToCSV(playersData)}
              exportToJson={() => exportToJSON(playersData)}
            />
          </>
        }

      </Container>
    </>
  );
};

export default App;
