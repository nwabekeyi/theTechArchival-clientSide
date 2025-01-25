import React from "react";
import { Box, Typography } from "@mui/material";

export default function Welcome() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingLeft: 2,
        backgroundColor: "background.paper",
        height: "100%",
        justifyContent: "center",
      }}
    >
      {/* You can replace this with an MUI Icon if needed */}
      <Typography variant="h5" sx={{ color: "text.secondary", textAlign: "center" }}>
        Select a Chat to Start Messaging
      </Typography>
    </Box>
  );
}
