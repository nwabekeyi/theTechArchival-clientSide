import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Card, CardContent, Avatar, Rating } from '@mui/material';
import { tokens } from '../../../theme';
import Calendar from './calendar';

import {
  mockInstructorAssignments,
  mockInstructorRecommendations,
} from '../../../data/mockData';
import SchoolIcon from '@mui/icons-material/School';
import ProgressCircle from '../../../components/ProgressCircle';
import useInstructorData from './useInstructorData';

const Instructor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [assignments, setAssignments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

   // Mock Announcements Data
   const mockAnnouncements = [
    {
      id: 1,
      title: "New Semester Starts",
      message: "The new semester starts on January 15th. Please make sure to review your schedule.",
      date: "2024-12-22",
    },
    {
      id: 2,
      title: "Maintenance Window",
      message: "Scheduled maintenance will occur on December 24th from 2:00 AM to 4:00 AM. Please plan accordingly.",
      date: "2024-12-22",
    },
    {
      id: 3,
      title: "Holiday Break",
      message: "The holiday break starts on December 23rd. All classes will resume on January 10th.",
      date: "2024-12-22",
    }
  ];
  
  const {
    instructorData,
    studentData,
    courseProgress,
    attendanceRate,
    nextClass,
    assignmentSubmissionRate,
    topStudents, // Changed from highestActivityStudent to topStudents
    leastStudents // Changed from lowestActivityStudent to leastStudents
  } = useInstructorData();

  useEffect(() => {
    let isMounted = true;

    setTimeout(() => {
      if (isMounted) {
        setAssignments(mockInstructorAssignments);
        setRecommendations(mockInstructorRecommendations);
      }
    }, 1000);

    return () => {
      isMounted = false;
    };
  }, []);

  const conBg = `${theme.palette.mode === "light" ? colors.blueAccent[800] : colors.greenAccent[600]} !important`


  return (
    <Box m="20px">
      {/* ROW 1 */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
        {/* Course Progress */}
        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} p="20px" borderRadius='8px'>
          <Typography variant="h5" fontWeight="600">
            Course Progress
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
            <ProgressCircle size="125" progress={courseProgress} />
            <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: "15px" }}>
              {`${courseProgress}% completed`}
            </Typography>
            <Typography>Completion rate</Typography>
          </Box>
        </Box>

        {/* Attendance */}
        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} p="20px" borderRadius='8px'>
          <Typography variant="h5" fontWeight="600">
            Attendance
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
            <ProgressCircle size="125" progress={attendanceRate} />
            <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: "15px" }}>
              {`${attendanceRate}% attendance rate`}
            </Typography>
            <Typography>Total attendance rate of students</Typography>
          </Box>
        </Box>

        {/* Assignment submissions */}
        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} p="20px" borderRadius='8px'>
          <Typography variant="h5" fontWeight="600">
            Assignment submissions
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
            <ProgressCircle size="125" progress={assignmentSubmissionRate} />
            <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: "15px" }}>
              {`${assignmentSubmissionRate}% submission rate`}
            </Typography>
            <Typography>Total assignment submission rate</Typography>
          </Box>
        </Box>

        {/* Next Lecture */}
        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} p="20px" borderRadius='8px'>
          <Typography variant="h5" fontWeight="600" mb="15px">
            Next Lecture
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            {nextClass ? (
              <Box textAlign="center">
                <SchoolIcon sx={{ fontSize: '50px', color: colors.blueAccent[500] }} />
                <Typography variant="h6">{nextClass.topic}</Typography>
                <Typography>{nextClass.date}</Typography>
                <Typography>{nextClass.time}</Typography>
              </Box>
            ) : (
              <Typography>No upcoming lectures.</Typography>
            )}
          </Box>
        </Box>
      </Box>


      {/* ROW 2 */}
       {/* THIRD ROW (MESSAGES + INSTRUCTOR PROFILE) */}
       <Box gridColumn="span 12" display="flex" gap="20px" sx={{ height: '300px' }} mt="20px">

         {/* Calendar */}
         <Box
            flex={2}
            backgroundColor={colors.primary[400]}
            p="20px"
            sx={{ overflowY: 'auto' }}
            borderRadius="10px"

          >
             <Typography variant="h5" fontWeight="600" mb="15px">
            Event calendar
          </Typography>
           <Calendar />
          </Box>
          
            {/* Announcement Box */}
        <Box 
             flex={1}
             backgroundColor={colors.primary[400]}
             p="20px"
             sx={{ overflowY: 'auto' }}
             borderRadius="10px"
>

          <Typography variant="h5" fontWeight="600" mb="15px">Announcements</Typography>
          {mockAnnouncements.map((announcement) => (
            <Card key={announcement.id} sx={{ mb: 2 }}>
              <CardContent sx={{backgroundColor: conBg}}>
                <Typography variant="h6">{announcement.title}</Typography>
                <Typography variant="body2">{announcement.message}</Typography>
                <Typography variant="caption" color="gray">{announcement.date}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        
        </Box>


        {/* ROW 3 */}

      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px" mt="20px" sx={{ height: '350px' }}>
  {/* Top 5 Students by Activity */}
  <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px" sx={{ overflowY: 'auto', height: "100%", borderRadius: '8px' }}>
    <Typography variant="h5" fontWeight="600" mb="15px">
      Top Students by Activity
    </Typography>
    {topStudents?.map((student, index) => (
      <Box 
        key={index} 
        display="flex" 
        alignItems="center" 
        justifyContent="flex-start" 
        mb={2} 
        backgroundColor={theme.palette.mode === "light" ? colors.greenAccent[300] : colors.primary[500]} 
        p="15px" 
        borderRadius="8px"
        sx={{
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Apply box shadow here for each student content
        }}
      >
        <Avatar
          src={student?.profilePicture}
          alt={`${student?.firstName} ${student?.lastName}`}
          sx={{ width: 50, height: 50, mr: 2 }} // Added right margin for spacing
        />
        <Box>
          <Typography variant="h6" color="white">
            {`${student?.firstName} ${student?.lastName}`}
          </Typography>
          <Typography variant="body2" color="white">
            {`Activity Rate: ${student?.activityRate}%`}
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>

  {/* Least Active Students */}
  <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px" sx={{ overflowY: 'auto', height: "100%", borderRadius: '8px' }}>
    <Typography variant="h5" fontWeight="600" mb="15px">
      Least Active Students
    </Typography>
    {leastStudents?.map((student, index) => (
      <Box 
        key={index} 
        display="flex" 
        alignItems="center" 
        justifyContent="flex-start" 
        mb={2} 
        backgroundColor={theme.palette.mode === "light" ? colors.greenAccent[300] : colors.primary[500]} 
        p="15px" 
        borderRadius="8px"
        sx={{
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Apply box shadow here for each student content
        }}
      >
        <Avatar
          src={student?.profilePicture}
          alt={`${student?.firstName} ${student?.lastName}`}
          sx={{ width: 50, height: 50, mr: 2 }} // Added right margin for spacing
        />
        <Box>
          <Typography variant="h6" color="white">
            {`${student?.firstName} ${student?.lastName}`}
          </Typography>
          <Typography variant="body2" color="white">
            {`Activity Rate: ${student?.activityRate}%`}
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
</Box>




      
      </Box>

  );
};

export default Instructor;
