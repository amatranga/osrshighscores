import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { modeMap } from '../helpers/constants';

const SearchBox = ({ findUsers, removePlayer, players, setPlayers, searchDisabled, setSearchDisabled }) => {
  const [user, setUser] = useState('');
  const [selectedMode, setSelectedMode] = useState('');

  useEffect(() => {
    if (players && players.length > 0) {
      const trimmedUsers = players.map(player => (
        {
          user: player.user.trim(),
          mode: player.mode
        }
      ));
      findUsers(trimmedUsers);
    }
  }, [players, findUsers]);

  useEffect(() => {
    if (user && user.length > 0) {
      setSearchDisabled(false);
    } else{
      setSearchDisabled(true);
    }
  }, [user, setSearchDisabled]);

  const handleChange = (e) => {
    setUser(e.target.value);
  }

  const handleDropdownChange = (e) => {
    const { value } = e.target;
    const selectedMode = modeMap[value];
    setSelectedMode(selectedMode.value);
  }

  const handleAddPlayer = () => {
    const mode = selectedMode || 'main';
    if (user) {
      setPlayers(prevPlayers => {
        // Only set players if the player/mode combo does NOT already exist
        const newPlayers = prevPlayers.filter(player => player.user === user && player.mode === mode);
        if (newPlayers.length) {
          return prevPlayers;
        }
        return [...prevPlayers, { user, mode }];
      });
      
      setUser(''); // Clear input field
      setSelectedMode(''); // Reset mode dropdown
    }
  };

  const handleRemovePlayer = (player, index) => {
    setPlayers(players.filter((_, i) => i !== index));
    setSearchDisabled(false);
    removePlayer(player);
  };

  return (
    <>
      {/* Large Screen View */}
      <Box sx={{ mb: 2, display: { xs: 'none', md: 'flex'}, gap: 2 }}>
        <TextField
          value={user}
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
          onClick={handleAddPlayer}
          disabled={user === '' || user.trim() === '' || searchDisabled}>
            Find Player
        </Button>
      </Box>

      {/* Small Screen View */}
      <>
        <Box sx={{ mb: 2, display: { xs: 'flex', md: 'none'}, gap: 2 }}>
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
            onClick={handleAddPlayer}
            disabled={user === '' || user.trim() === '' || searchDisabled}>
            Find Player
          </Button>
        </Box>
      </>

      {/* Display added players */}
      {players.length > 0 && (
        <>
          <Box sx={{ mb: 2 }}>
            <Box>
              <Typography variant="subtitle1">Players to Compare:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {players.map((player, index) => (
                  <Chip
                    key={index}
                    label={`${player.user} (${modeMap[player.mode]?.name})`}
                    onDelete={() => handleRemovePlayer(player, index)}
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default SearchBox;
