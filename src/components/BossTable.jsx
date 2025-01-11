import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2 as Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  Star,
  StarBorder,
} from '@mui/icons-material';
import { ACTIVITY_END_INDEX } from '../helpers/constants';

const tableCells = [
  { name: 'KC', id: 'kc' },
  { name: 'Rank', id: 'rank' },
];

const BossTable = ({ players, addFavorite, removeFavorite, isFavorite }) => {
  const [selectedDataPoint, setSelectedDataPoint] = useState('KC');

  // Extract boss names from the first player
  const bossNames = players[0].data.activities.slice(ACTIVITY_END_INDEX).map(boss => boss.name);

  // Helper function to get max values for each boss
  const getMaxValues = (bossName) => {
    const bossStats = players.map(player => {
      const boss = player.data.activities.slice(ACTIVITY_END_INDEX).find(b => b.name === bossName) || {};
      return {
        score: boss.score > 0 ? boss.score : 0,
        rank: boss.rank > 0 ? boss.rank : Number.MAX_VALUE, // Ranks are better when lower
      };
    });

    const maxScore = Math.max(...bossStats.map(stat => stat.score));
    const minRank = Math.min(...bossStats.map(stat => stat.rank));

    return { maxScore, minRank };
  };

  const handleRadioSelect = (e) => {
    setSelectedDataPoint(e.target.value);
  };

  return (
    <Grid size={{ xs: 12 }}>
      <Card>
        <CardContent>
        <Typography component='div' variant='h5'>Bosses</Typography>
          <FormControl>
            <FormLabel id='boss-table-datapoint-selector' />
            <RadioGroup
              row
              aria-labelledby='boss-table-datapoint-selector'
              name='boss-table-radio-buttons-group'
              value={selectedDataPoint}
            >
              {tableCells.map(cell => (
                <FormControlLabel
                  key={cell.id}
                  value={cell.name}
                  control={<Radio />}
                  label={cell.name}
                  onChange={handleRadioSelect}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <TableContainer component={Paper} sx={{ maxHeight: { xs: 300, md: 500 }, overflowX: 'scroll' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Boss</TableCell>
                  {tableCells.map(label =>
                    players.map(player => (
                      label.name === selectedDataPoint &&
                      <TableCell key={`${player.id}-${label.id}`} sx={{ whiteSpace: 'nowrap' }}>
                        {/* {player.username} ({label.name}) */}
                        <Button
                          variant={isFavorite(player.username) ? 'contained': 'outlined'}
                          color='primary'
                          onClick={() => 
                            isFavorite(player.username)
                              ? removeFavorite(player.username)
                              : addFavorite(player)
                          }
                        >
                          <>{player.username}{' '}({label.name}){' '}</>
                          {isFavorite(player.username) && <Star />}
                          {!isFavorite(player.username) && <StarBorder />}
                        </Button>
                      </TableCell>
                    ))
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {bossNames.map(bossName => {
                  const { maxScore, minRank } = getMaxValues(bossName);

                  return (
                    <TableRow key={bossName}>
                      <TableCell>{bossName}</TableCell>
                      {/* KC table */}
                      {players.map(player => {
                        const boss = player.data.activities.slice(ACTIVITY_END_INDEX).find(b => b.name === bossName) || {};
                        const isMaxScore = boss.score === maxScore;

                        return (
                          selectedDataPoint === 'KC' &&
                          <TableCell
                            key={`${player.id}-${bossName}-kc`}
                            sx={{
                              fontWeight: players.length > 1 && isMaxScore ? 'bold' : 'normal',
                              backgroundColor: players.length > 1 && isMaxScore ? 'rgba(30, 144, 255, 0.3)' : 'inherit',
                            }}
                          >
                            {boss.score && boss.score > 0 ? boss.score.toLocaleString() : '-'}
                          </TableCell>
                        );
                      })}

                      {/* Rank table */}
                      {players.map(player => {
                        const boss = player.data.activities.slice(ACTIVITY_END_INDEX).find(b => b.name === bossName) || {};
                        const isMinRank = boss.rank === minRank;

                        return (
                          selectedDataPoint === 'Rank' && 
                          <TableCell
                            key={`${player.id}-${bossName}-rank`}
                            sx={{
                              fontWeight: players.length > 1 && isMinRank ? 'bold' : 'normal',
                              backgroundColor: players.length > 1 && isMinRank ? 'rgba(255, 215, 0, 0.3)' : 'inherit',
                            }}
                          >
                            {boss.rank && boss.rank > 0 ? boss.rank.toLocaleString() : '-'}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default BossTable;
