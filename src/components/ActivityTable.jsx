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
  { name: 'Count', id: 'count' },
  { name: 'Rank', id: 'rank' },
];

const ActivityTable = ({ players, addFavorite, removeFavorite, isFavorite }) => {
  const [selectedDataPoint, setSelectedDataPoint] = useState('Count');

  // Extract activity names from the first player
  const activityNames = players[0].data.activities.slice(0, ACTIVITY_END_INDEX).map(activity => activity.name);

  // Helper function to get max values for each activity
  const getMaxValues = (activityName) => {
    const activityStats = players.map(player => {
      const activity = player.data.activities.slice(0, ACTIVITY_END_INDEX).find(a => a.name === activityName) || {};
      return {
        score: activity.score > 0 ? activity.score : 0,
        rank: activity.rank > 0 ? activity.rank : Number.MAX_VALUE, // Ranks are better when lower
      };
    });

    const maxScore = Math.max(...activityStats.map(stat => stat.score));
    const minRank = Math.min(...activityStats.map(stat => stat.rank));

    return { maxScore, minRank };
  };

  const handleRadioSelect = (e) => {
    setSelectedDataPoint(e.target.value);
  };

  return (
    <Grid size={{ xs: 12 }}>
      <Card>
        <CardContent>
        <Typography component='div' variant='h5'>Activities</Typography>
          <FormControl>
            <FormLabel id='activity-table-datapoint-selector' />
            <RadioGroup
              row
              aria-labelledby='activity-table-datapoint-selector'
              name='activity-table-radio-buttons-group'
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
                  <TableCell>Activity</TableCell>
                  {tableCells.map(label =>
                    players.map(player => (
                      label.name === selectedDataPoint && 
                      <TableCell key={`${player.id}-${label.id}`} sx={{ whiteSpace: 'nowrap' }}>
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
                {activityNames.map(activityName => {
                  const { maxScore, minRank } = getMaxValues(activityName);

                  return (
                    <TableRow key={activityName}>
                      <TableCell>{activityName}</TableCell>
                      {players.map(player => {
                        const activity = player.data.activities.slice(0, ACTIVITY_END_INDEX).find(a => a.name === activityName) || {};
                        const isMaxScore = activity.score === maxScore;

                        return (
                          selectedDataPoint === 'Count' &&
                          <TableCell
                            key={`${player.id}-${activityName}-count`}
                            sx={{
                              fontWeight: players.length > 1 && isMaxScore ? 'bold' : 'normal',
                              backgroundColor: players.length > 1 && isMaxScore ? 'rgba(30, 144, 255, 0.3)' : 'inherit',
                            }}
                          >
                            {activity.score && activity.score > 0 ? activity.score.toLocaleString() : '-'}
                          </TableCell>
                        );
                      })}
                      {players.map(player => {
                        const activity = player.data.activities.slice(0, ACTIVITY_END_INDEX).find(a => a.name === activityName) || {};
                        const isMinRank = activity.rank === minRank;

                        return (
                          selectedDataPoint === 'Rank' && 
                          <TableCell
                            key={`${player.id}-${activityName}-rank`}
                            sx={{
                              fontWeight: players.length > 1 && isMinRank ? 'bold' : 'normal',
                              backgroundColor: players.length > 1 && isMinRank ? 'rgba(255, 215, 0, 0.3)' : 'inherit',
                            }}
                          >
                            {activity.rank && activity.rank > 0 ? activity.rank.toLocaleString() : '-'}
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

export default ActivityTable;
