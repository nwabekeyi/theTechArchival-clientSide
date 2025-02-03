import React from "react";
import { Box } from "@mui/material";

// Higher-Order Component
const withDashboardWrapper = (WrappedComponent) => {
  return (props) => {
    const { home } = props; // Destructure props to get 'home'
    console.log('Home prop in HOC:', home); // Should log 'true'

    return (
<<<<<<< HEAD
      <Box sx={{ p: 4, margin: -3 }}>
=======
      <Box sx={{ p: 3, mx: home ? 0 : 3 }}>
        {/* Pass all props down to the WrappedComponent */}
>>>>>>> f4ab24f14a832167941a17e00be77d256be75db6
        <WrappedComponent {...props} />
      </Box>
    );
  };
};

export default withDashboardWrapper;
