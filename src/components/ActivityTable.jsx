import React from 'react';
import {
  Card,
  CardContent,
  Grid2 as Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

const tableCells = [
  'Activity',
  'Score',
  'Rank',
];

const ActivityTable = ({ activities, userInfo }) => (
  <Grid size={{ xs: 12, md: 6 }}>
    <Card>
      <CardContent>
        <Typography variant='h6'>Activities for {userInfo.username}</Typography>
        <TableContainer component={Paper} sx={{ maxHeight: { xs: 300, md: 500 }, overflowX: 'hidden' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {tableCells.map(cell => (
                  <TableCell key={cell} sx={{ whiteSpace: 'nowrap' }}>{cell}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {activities.map(activity => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell>{activity.score.toLocaleString()}</TableCell>
                  <TableCell>{activity.rank.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  </Grid>
);

export default ActivityTable;
