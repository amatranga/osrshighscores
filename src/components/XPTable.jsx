import React, { useState } from 'react';
import {
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

const tableCells = [
  { name:'Level', id: 'level' },
  { name: 'XP', id: 'xp' }, 
  { name: 'Rank', id: 'rank' },
];

const XPTable = ({ players }) => {
  const [selectedDataPoint, setSelectedDataPoint] = useState('Level');

  // Extract skill names from the first player as headers
  const skillNames = players[0].data.skills.map(skill => skill.name);

  // Helper function to get max values for each skill
  const getMaxValues = (skillName) => {
    const skillStats = players.map(player => {
      const skill = player.data.skills.find(s => s.name === skillName) || {};
      return {
        level: skill.level || 0,
        xp: skill.xp || 0,
        rank: skill.rank || Number.MAX_VALUE, // Ranks are better when lower
      };
    });

    const maxLevel = Math.max(...skillStats.map(stat => stat.level));
    const maxXP = Math.max(...skillStats.map(stat => stat.xp));
    const minRank = Math.min(...skillStats.map(stat => stat.rank));

    return { maxLevel, maxXP, minRank };
  };

  const handleRadioSelect = e => {
    setSelectedDataPoint(e.target.value);
  }

  return (
    <Grid size={{ xs: 12 }}>
      <Card>
        <CardContent>
          <Typography component='div' variant='h5'>Skills</Typography>
          <FormControl sx={{ mt: 2 }}>
            <FormLabel id='xp-table-datapoint-selector' />
            <RadioGroup
              row
              aria-labelledby='xp-table-datapoint-selector'
              name='xp-table-radio-buttons-group'
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
                  <TableCell>Skill</TableCell>
                  {/* Player (Level) */}
                  {tableCells.map(label =>
                    players.map(player => (
                      label.name === selectedDataPoint && 
                      <TableCell key={`${player.id}-${label.id}`} sx={{ whiteSpace: 'nowrap' }}>
                        {player.username} ({label.name})
                      </TableCell>
                    ))
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {skillNames.map(skillName => {
                  const { maxLevel, maxXP, minRank } = getMaxValues(skillName);

                  return (
                    <TableRow key={skillName}>
                      <TableCell>{skillName}</TableCell>
                      {players.map(player => {
                        const skill = player.data.skills.find(s => s.name === skillName) || {};
                        const isMaxLevel = skill.level === maxLevel;

                        return (
                          selectedDataPoint === 'Level' &&
                          <TableCell
                            key={`${player.id}-${skillName}-level`}
                            sx={{
                              fontWeight: players.length > 1 && isMaxLevel ? 'bold' : 'normal',
                              backgroundColor: players.length > 1 && isMaxLevel ? 'rgba(60, 179, 113, 0.3)' : 'inherit',
                            }}
                            >
                              {skill.level && skill.level > 0 ? skill.level : '-'}
                          </TableCell>
                        );
                      })}
                      {players.map(player => {
                        const skill = player.data.skills.find(s => s.name === skillName) || {};
                        const isMaxXP = skill.xp === maxXP;

                        return (
                          selectedDataPoint === 'XP' &&
                          <TableCell
                            key={`${player.id}-${skillName}-xp`}
                            sx={{
                              fontWeight: players.length > 1 && isMaxXP ? 'bold' : 'normal',
                              backgroundColor: players.length > 1 && isMaxXP ? 'rgba(30, 144, 255, 0.3)' : 'inherit',
                            }}
                          >
                            {skill.xp && skill.xp > 0 ? skill.xp.toLocaleString() : '-'}
                          </TableCell>
                        );
                      })}
                      {players.map(player => {
                        const skill = player.data.skills.find(s => s.name === skillName) || {};
                        const isMinRank = skill.rank === minRank;

                        return (
                          selectedDataPoint === 'Rank' && 
                          <TableCell
                            key={`${player.id}-${skillName}-rank`}
                            sx={{
                              fontWeight: players.length > 1 && isMinRank ? 'bold' : 'normal',
                              backgroundColor: players.length > 1 && isMinRank ? 'rgba(255, 215, 0, 0.3)' : 'inherit',
                            }}
                          >
                            {skill.rank && skill.rank > 0 ? skill.rank.toLocaleString() : '-'}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )}
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default XPTable;
