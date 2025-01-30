import React from 'react';
import { Box, Button, Stack } from '@mui/material';

const Favorites = ({ favorites, findUsers, removeFavorite, addPlayerToSearchBox }) => {
  const handleViewPlayer = (player) => {
    findUsers([{ user: player.username, mode: player.mode }]);
    addPlayerToSearchBox({ user: player.username, mode: player.mode });
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Stack sx={{ mb: 4 }}>
        <h2>Favorites</h2>
        {favorites.length === 0 ? (
          <p>No favorite players yet!</p>
        ) : (
          favorites.map((fav) => (
            <Stack key={fav.id} direction="row" spacing={2} sx={{ mb: 1 }}>
              <span>{fav.username} ({fav.mode})</span>
              <Button variant='contained' onClick={() => handleViewPlayer(fav)}>
                View
              </Button>
              <Button variant="outlined" color="error" onClick={() => removeFavorite(fav.username)}>
                Remove
              </Button>
            </Stack>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default Favorites;
