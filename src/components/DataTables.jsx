import React from 'react';
import { Grid2 as Grid } from '@mui/material';
import XPTable from './XPTable';
import ActivityTable from './ActivityTable';
import BossTable from './BossTable';
import SkillsChart from './SkillsChart';

const DataTables = ({
  players,
  shownTables,
  addFavorite,
  isFavorite,
  removeFavorite,
  visualizationData,
  options,
}) => (
  <Grid container spacing={1}>
    {players.length > 0 && shownTables.skillsTable && (
      <XPTable
        players={players}
        addFavorite={addFavorite}
        removeFavorite={removeFavorite}
        isFavorite={isFavorite}
      />
    )}
    {players.length > 0 && shownTables.activitiesTable && (
      <ActivityTable
        players={players}
        addFavorite={addFavorite}
        removeFavorite={removeFavorite}
        isFavorite={isFavorite}
      />
    )}
    {players.length > 0 && shownTables.bossesTable && (
      <BossTable
        players={players}
        addFavorite={addFavorite}
        removeFavorite={removeFavorite}
        isFavorite={isFavorite}
      />
    )}
    {visualizationData.datasets &&
      players.length > 0 &&
      shownTables.skillsChart && (
        <SkillsChart data={visualizationData} options={options} />
    )}
  </Grid>
);

export default DataTables;
