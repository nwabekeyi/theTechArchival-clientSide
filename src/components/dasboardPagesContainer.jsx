import React from "react";
import { Box } from "@mui/material";

// Higher-Order Component
const withDashboardWrapper = (WrappedComponent) => {
  return (props) => {
    return (
      <Box sx={{ px: 4 }}>
        <WrappedComponent {...props} />
      </Box>
    );
  };
};



// Export the HOC wrapped version of Instructors
export default withDashboardWrapper;
