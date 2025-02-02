import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
} from '@mui/material';

const ShownItemsToggle = ({ shownTables, toggleTableVisibility }) => (
  <Box sx={{ mb: 2 }}>
    <Stack spacing={2} sx={{ mb: 2 }} direction='row'>
      <FormControlLabel
        control={<Checkbox checked={shownTables.skillsTable} onChange={() => toggleTableVisibility('skillsTable')} />}
        label="Show Skills Table"
      />
      <FormControlLabel
        control={<Checkbox checked={shownTables.skillsChart} onChange={() => toggleTableVisibility('skillsChart')} />}
        label="Show Skills Chart"
      />
      <FormControlLabel
        control={<Checkbox checked={shownTables.activitiesTable} onChange={() => toggleTableVisibility('activitiesTable')} />}
        label="Show Activities Table"
      />
      <FormControlLabel
        control={<Checkbox checked={shownTables.bossesTable} onChange={() => toggleTableVisibility('bossesTable')} />}
        label="Show Bosses Table"
      />
    </Stack>
  </Box>
);

export default ShownItemsToggle;
