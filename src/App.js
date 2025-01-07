import React from 'react';
import { Container } from '@mui/material';
import Header from './components/Header.jsx';
import SearchBox from './components/SearchBox.jsx';
import DataTables from './components/DataTables.jsx';
import ErrorMessages from './components/ErrorMessages.jsx';
import ShownItemsToggle from './components/ShownItemsToggle.jsx';
import Favorites from './components/Favorites.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { useAppState } from './hooks/useAppState.js';
import { useFavorites } from './hooks/useFavorites.js';
import { useFindUsers } from './hooks/useFindUsers.js';

const App = () => {
  const {
    darkMode,
    toggleDarkMode,
    playersData,
    setPlayersData,
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
  } = useAppState();

  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useFavorites(setPlayers);

  const { findUsers } = useFindUsers(setErrors, setPlayersData, setLoading);

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

        {loading && <LoadingSpinner />}

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
