import React from 'react';
import {
  Card,
  CardContent,
  Grid2 as Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

const tableCells = [
  'Skill',
  'Level',
  'Experience',
  'Rank'
];

const XPTable = ({ skills, userInfo }) => (
  <Grid size={{ xs: 12 }}>
    <Card>
      <CardContent>
        <Typography variant='h6'>Skills for {userInfo.username}</Typography>
        <TableContainer component={Paper} sx={{ maxHeight: {xs: 300, md: 500 }, overflowX: 'hidden' }}>
          <Table stickyHeader>

            <TableHead>
              <TableRow>
                {tableCells.map(cell => (
                  <TableCell key={cell} sx={{ whiteSpace: 'nowrap' }}>{cell}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {skills.map(skill => (
                <TableRow key={skill.id}>
                  <TableCell>{skill.name}</TableCell>
                  <TableCell>{skill.level}</TableCell>
                  <TableCell>{skill.xp.toLocaleString()}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', pr: 5 }}>{skill.rank.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  </Grid>
);

export default XPTable;
