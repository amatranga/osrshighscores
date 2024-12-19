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
  'Boss',
  'Score',
  'Rank',
];

const BossTable = ({ bosses, userInfo }) => (
  <Grid size={{ xs: 12, md: 6 }}>
    <Card>
      <CardContent>
        <Typography variant='h6'>Bosses for {userInfo.username}</Typography>
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
              {bosses.map(boss => (
                <TableRow key={boss.id}>
                  <TableCell>{boss.name}</TableCell>
                  <TableCell>{boss.score.toLocaleString()}</TableCell>
                  <TableCell>{boss.rank.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  </Grid>
);

export default BossTable;
