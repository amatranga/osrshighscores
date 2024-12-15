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
  'Username',
  'Skill',
  'Level',
  'Experience',
];

const XPTable = (data) => (
  <Grid container spacing={4}>
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <Typography variant='h6'>Skill Comparison</Typography>
          <TableContainer component={Paper}>
            <Table>

              <TableHead>
                <TableRow>
                  {tableCells.map(cell => (
                    <TableCell key={cell}>{cell}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                
              </TableBody>

            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

export default XPTable;
