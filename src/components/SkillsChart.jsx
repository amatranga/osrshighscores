import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid2 as Grid,
  Typography,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  LogarithmicScale,
} from "chart.js";
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Tooltip,
  Legend,
);

const SkillsChart = ({ data, options }) => (
  <Grid size={12} sx={{ mt: 1 }}>
    <Card>
      <CardContent>
        <Typography variant="subtitle1">
          Skill Levels Bar Chart
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  </Grid>
);

export default SkillsChart;
