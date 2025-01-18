import React from 'react';
import { Box, Typography } from '@mui/material';

export default function GroupParticipants({ participants }) {
  console.log(participants);
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Group Participants</Typography>
      {participants.map((participant, index) => (
        <Typography key={index} variant="body2">
          {participant.firstName} {participant.lastName} ({participant.role})
        </Typography>
      ))}
    </Box>
  );
}
