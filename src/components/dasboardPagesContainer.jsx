import React from "react";
import { Box } from "@mui/material";

// Higher-Order Component
const withDashboardWrapper = (WrappedComponent) => {
  return (props) => {
    return (
      <Box sx={{ p: 3, m:3 }}>
        <WrappedComponent {...props} />
      </Box>
    );
  };
};



// Export the HOC wrapped version of Instructors
export default withDashboardWrapper;
