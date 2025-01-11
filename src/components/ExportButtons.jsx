import React from 'react';
import { Box, Button } from '@mui/material';

const ExportButtons = ({ exportToCsv, exportToJson }) => (
  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
    <Button variant='contained' color='primary' onClick={exportToCsv}>
      Export to CSV
    </Button>
    <Button variant='contained' color='secondary' onClick={exportToJson}>
      Export to JSON
    </Button>
  </Box>
);

export default ExportButtons;
