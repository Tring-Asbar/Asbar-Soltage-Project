import React from 'react';
import { Snackbar, Alert, AlertColor, Slide } from '@mui/material';

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity?: AlertColor; // 'error' | 'warning' | 'info' | 'success'
  duration?: number;
  onClose: () => void;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  message,
  severity = 'success',
  duration = 3000,
  onClose,
  position = { vertical: 'top', horizontal: 'right' },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={position}
      TransitionComponent={(props) => <Slide {...props} direction="left" />} 
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%'}}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
