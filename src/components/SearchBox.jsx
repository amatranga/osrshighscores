import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

const modeMap = {
  main: { name: 'Main', value: 'main' },
  iron: { name: 'Ironman', value: 'iron' },
  hcim: { name: 'Hardcore Ironman', value: 'hcim' },
  uim: { name: 'Ultimate Ironman', value: 'uim' },
  deadman: { name: 'Deadman Mode', value: 'deadman' },
  seasonal: { name: 'Leagues', value: 'seasonal' },
  tournament: { name: 'Tournament', value: 'tournament' },
  freshStart: { name: 'Fresh Start', value: 'freshStart' },
};


const SearchBox = ({onClick}) => {
  const [user, setUser] = useState('');
  const [selectedMode, setSelectedMode] = useState('');

  const handleChange = e => {
    const { value } = e.target;
    if (value && value.trim() !== '') {
      setUser(value.trim());
    } else {
      setUser('');
    }
  }

  const handleDropdownChange = e => {
    const { value } = e.target;
    const selectedMode = modeMap[value];
    setSelectedMode(selectedMode.value);
  }

  const handleClick = () => {
    const mode = selectedMode || 'main';
    const data = { user, mode };
    onClick(data);
  }

  return (
    <>
      <Box sx={{ mb: 4, display: { xs: 'none', md: 'flex'}, gap: 2 }}>
        <TextField
          label="Enter Username"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          autoFocus
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="mode-selector-label">Mode</InputLabel>
          <Select
            labelId="mode-selector-label"
            value={selectedMode}
            onChange={handleDropdownChange}
            label="Mode"
          >
            {Object.values(modeMap).map(mode => (
              <MenuItem key={mode.value} value={mode.value}>
                {mode.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          disabled={user === '' || user.trim() === ''}>
          Search
        </Button>
      </Box>

      {/* Small Screen View */}
      <Box sx={{ mb: 4, display: { xs: 'flex', md: 'none'}, gap: 2 }}>
        <TextField
          label="Enter Username"
          variant="outlined"
          fullWidth
          onChange={handleChange}
        />
      </Box>
      <Box sx={{ mb: 4, display: { xs: 'flex', md: 'none' }, gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }} fullWidth>
          <InputLabel id="mode-selector-label">Mode</InputLabel>
          <Select
            labelId="mode-selector-label"
            value={selectedMode}
            onChange={handleDropdownChange}
            label="Mode"
          >
            {Object.values(modeMap).map(mode => (
              <MenuItem key={mode.value} value={mode.value}>
                {mode.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        disabled={user === '' || user.trim() === ''}>
        Search
      </Button>
      </Box>
    </>
  );
}

export default SearchBox;
