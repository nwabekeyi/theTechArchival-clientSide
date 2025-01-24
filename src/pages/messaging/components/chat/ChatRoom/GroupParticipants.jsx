import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

export default function GroupParticipants({
  title = 'Group Participants', // Default title
  participants = [], // Default to an empty array if undefined
  sx = {}, // Default to an empty object for custom styles
  titleSx = {}, // Custom styles for the title
}) {
  // Filter out duplicate participants by id
  const uniqueParticipants = participants.filter(
    (participant, index, self) => {
     if(participant.userId){
      participant.userId && // Check that userId exists
      index === self.findIndex((p) => p.userId === participant.userId)
     }
    }
  );
  
  console.log('Unique Participants:', uniqueParticipants);
  console.log('First userId:', uniqueParticipants[0]?.userId);  
  

  return (
    <Box sx={{ padding: 2, ...sx }}>
      <Typography variant="h6" gutterBottom sx={{ ...titleSx }}>
        {title}
      </Typography>
      {uniqueParticipants.length > 0 ? (
        uniqueParticipants.map((participant, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 1.5,
              padding: 1,
              borderRadius: 1,
              boxShadow: 1,
              bgcolor: 'background.paper',
            }}
          >
            <Avatar
              alt={`${participant.firstName} ${participant.lastName}`}
              src={participant.profilePictureURL} // Assuming participant object has a profilePictureURL
              sx={{ marginRight: 2 }}
            />
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {participant.firstName} {participant.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {participant.role}
              </Typography>
            </Box>
          </Box>
        ))
      ) : (
        // Replace the text with three circles
        <Box sx={{ display: 'flex', gap: '4px', alignItems: 'start' }}>
          <Box
            sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'gray',
            }}
          ></Box>
          <Box
            sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'gray',
            }}
          ></Box>
          <Box
            sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'gray',
            }}
          ></Box>
        </Box>
      )}
    </Box>
  );
}
