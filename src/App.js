import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Container } from '@mui/material';
import Header from './components/Header';
import SearchBox from './components/SearchBox';
import XPTable from './components/XPTable';
import { getHighScoreByMode } from './api/api';

const findUser = ({user, mode}) => {
  getHighScoreByMode(mode, user).then(res => {
    console.log(res);
  })
}

const App = () => {
  const [player1Data, setPlayer1Data] = useState([]);
  return (
    <ThemeProvider>
      <Header />
      <Container sx={{ mt: 4 }}>
        <SearchBox onClick={findUser} />
        <XPTable data={player1Data} />
      </Container>
    </ThemeProvider>
  );
};

export default App;
