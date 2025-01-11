import { React } from 'react';
import { CircularProgress } from '@mui/material';

const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
    <CircularProgress />
  </div>
);

export default LoadingSpinner;
