import React from "react";
import { Box } from "@mui/material";

// Higher-Order Component
const withDashboardWrapper = (WrappedComponent) => {
  const production =  import.meta.env.EVN

  return (props) => {
    return (
      <Box sx={{ p: 3, m:production === "production" ? 0 : 3 }}>
        <WrappedComponent {...props} />
      </Box>
    );
  };
};



// Export the HOC wrapped version of Instructors
export default withDashboardWrapper;
