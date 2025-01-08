import React from 'react';
import { Stack, Alert } from '@mui/material';

const ErrorMessages = ({ errors, setErrors }) => (
  <Stack sx={{ width: '100%' }} spacing={2}>
    {errors.map((error, idx) => (
      <Alert
        key={idx}
        severity="error"
        onClose={() => setErrors((prev) => prev.filter((e) => e.id !== error.id))}
      >
        {error.message}
      </Alert>
    ))}
  </Stack>
);

export default ErrorMessages;