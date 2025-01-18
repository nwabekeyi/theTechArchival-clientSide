import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { useSelector } from 'react-redux';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';

const InstructorReviews = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading, data, error, callApi } = useApi();
  
  // Accessing the instructorId from the Redux store
  const instructorId = useSelector((state) => state.users.user._id); // Make sure this is correctly set in the Redux store

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (instructorId) {
      callApi(`${endpoints.REVIEW}/${instructorId}`, 'GET');
    }
  }, [instructorId]);

  useEffect(() => {
    if (data) {
      setReviews(data); // Assuming the API response is the array of reviews
    }
  }, [data]);

  if (loading) {
    return <Typography>Loading reviews...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error">
        Error fetching reviews: {error.message || 'Something went wrong'}
      </Typography>
    );
  }

  return (
    <Box m="20px">
      <Typography variant="h4" fontWeight="600" mb="20px" color={colors.greenAccent[500]}>
        Instructor Reviews
      </Typography>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <Box
            key={index}
            mb={2}
            p={2}
            borderRadius="8px"
            boxShadow={2}
            bgcolor={colors.primary[400]}
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <Typography variant="body1" sx={{ mt: 1 }}>
              Rating: {review.rating} / 5
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {review.reviewText || 'No review text provided.'}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography>No reviews available for this instructor.</Typography>
      )}
    </Box>
  );
};

export default InstructorReviews;
