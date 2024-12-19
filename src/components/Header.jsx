import React from 'react';
import { 
  AppBar,
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';

const Header = ({ darkMode, toggleDarkMode }) => (
  <AppBar position="static">
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <Typography
          variant='h5'
          component='div'
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          OSRS High Scores
        </Typography>

        <Grid container sx={{ display: { xs: 'flex', md: 'none' }}}>
          <Grid size={12}>
            <Typography
              variant='h5'
              component='div'
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                fontFamily: 'monospace',
                flexGrow: 1,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              OSRS High Scores
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant='p'>A high score comparison tool for Old School Runescape</Typography>
          </Grid>
        </Grid>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }}}>
          <Typography variant='p'> A high score comparison tool for Old School Runescape</Typography>
        </Box>
        <Button variant="contained" onClick={toggleDarkMode}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </Button>
      </Toolbar>
    </Container>
  </AppBar>
);

export default Header;
