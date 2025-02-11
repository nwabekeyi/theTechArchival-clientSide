import React from "react";
import { Box } from "@mui/material";

// Higher-Order Component
const withDashboardWrapper = (WrappedComponent) => {
  return (props) => {
    const { home } = props; // Destructure props to get 'home'
    console.log('Home prop in HOC:', home); // Should log 'true'

    return (
<Box sx={{ 
            p: { xs: 1, sm: 1, md: 1, lg: 2}, 
            // pr: { xs: 0, sm: 0, md: 0, lg: 2 }, 
            mx: { xs: 1, md: 0 },
            overflow: 'auto',
            maxWidth: {sx: '90%', sm: '100%', md:"100%", lg: '100%'}
            }}>
        <WrappedComponent {...props} />
      </Box>
    );
  };
};

export default withDashboardWrapper;
