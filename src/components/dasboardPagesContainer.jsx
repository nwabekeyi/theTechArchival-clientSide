import React from "react";
import { Box } from "@mui/material";

// Higher-Order Component
const withDashboardWrapper = (WrappedComponent) => {
  return (props) => {
    const { home } = props; // Destructure props to get 'home'
    console.log('Home prop in HOC:', home); // Should log 'true'

    return (
      <Box sx={{ p: 3, mx: home ? 0 : 3}}>
        {/* Pass all props down to the WrappedComponent */}
        <WrappedComponent {...props} />
      </Box>
    );
  };
};

export default withDashboardWrapper;
