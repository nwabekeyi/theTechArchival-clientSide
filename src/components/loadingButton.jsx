import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Create a styled version of the Button component
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'black',
  padding: '2% 0',
  border: 'none',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '20px',
  cursor: 'pointer',
  marginTop: '15px',
  transition: 'background 0.3s',
  zIndex: 3,

  '&:hover': {
    backgroundColor: '#fff',
    color: 'black',
    border: 'solid 2px black',
  },
}));

const LoadingButton = ({ isLoading, children, ...props }) => {
  return (
    <StyledButton
      {...props}
      disabled={isLoading}
      endIcon={isLoading && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 1,
          }}
        >
          <CircularProgress size={20} />
        </Box>
      )}
    >
      {children}
    </StyledButton>
  );
};

export default LoadingButton;
