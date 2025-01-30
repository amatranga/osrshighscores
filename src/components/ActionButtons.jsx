import React from 'react';
import { Box, ButtonGroup, Button } from '@mui/material';

const ActionButtons = ({
  showFavorites,
  setShowFavorites,
  showCharts,
  setShowCharts,
}) => {
  const buttons = [
    {
      title: 'Favorites',
      condition: showFavorites ? 'contained' : 'outlined',
      action: () => {
        setShowCharts(false);
        setShowFavorites((prev) => !prev);
      },
      id: 'favorite',
    },
    {
      title: 'Charts',
      condition: showCharts ? 'contained' : 'outlined',
      action: () => {
        setShowCharts((prev) => !prev);
        setShowFavorites(false);
      },
      id: 'charts',
    },
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <ButtonGroup>
        {buttons.map((button) => (
          <Button
            key={button.id}
            variant={button.condition}
            onClick={button.action}
          >
            {button.title}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default ActionButtons;
