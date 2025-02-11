import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Card, CardContent, Avatar, useMediaQuery } from '@mui/material';
import { tokens } from '../../../theme';
import Calendar from './calendar';
import DashboardDataBox from '../../../components/dashbaordDataBox';
import SchoolIcon from '@mui/icons-material/School';
import ProgressCircle from '../../../components/ProgressCircle';
import useInstructorData from './useInstructorData';

const Instructor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));


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
    courseProgress,
    attendanceRate,
    nextClass,
    assignmentSubmissionRate,
    topStudents,
    leastStudents
  } = useInstructorData();


  const conBg = `${theme.palette.mode === "light" ? colors.blueAccent[800] : colors.greenAccent[600]} !important`

  return (
    <Box>
      {/* ROW 1 */}


      <Box display="grid" gridTemplateColumns={`repeat(${isMobile ? 1 : isTablet ? 2 : 12}, 1fr)`} gap="20px">
        {/* Course Progress */}

        <DashboardDataBox
        gridColumn = {`span ${isMobile ? 1 : isTablet ? 2 : 3}`}>
            <Typography variant="h5" fontWeight="600" textAlign='center'>
            Course Progress
          </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" mt="25px" 
           >
            <ProgressCircle size="125" progress={courseProgress} />
            <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: "15px" }}>
              {`${courseProgress}% completed`}
            </Typography>
            <Typography>Completion rate</Typography>
          </Box>
      </DashboardDataBox>

        {/* Attendance */}

        <DashboardDataBox
        gridColumn = {`span ${isMobile ? 1 : isTablet ? 2 : 3}`}>
             <Typography variant="h5" fontWeight="600" textAlign='center'>
            Attendance
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
            <ProgressCircle size="125" progress={attendanceRate} />
            <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: "15px" }}>
              {`${attendanceRate}% attendance rate`}
            </Typography>
            <Typography>Total attendance rate of students</Typography>
          </Box>
      </DashboardDataBox>

        {/* Assignment submissions */}

        <DashboardDataBox
        gridColumn = {`span ${isMobile ? 1 : isTablet ? 2 : 3}`}>
             <Typography variant="h5" fontWeight="600" textAlign='center'>
            Assignment submissions
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
            <ProgressCircle size="125" progress={assignmentSubmissionRate} />
            <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: "15px" }}>
              {`${assignmentSubmissionRate}% submission rate`}
            </Typography>
            <Typography>Total assignment submission rate</Typography>
          </Box>
      </DashboardDataBox>

        {/* Next Lecture */}

        
        <DashboardDataBox
        gridColumn = {`span ${isMobile ? 1 : isTablet ? 2 : 3}`}>
            <Typography variant="h5" fontWeight="600" mb="15px" textAlign='center'>
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
      </DashboardDataBox>
      </Box>

      {/* ROW 2 */}
      <Box display="grid" gridTemplateColumns={`repeat(${isMobile ? 1 : isTablet ? 2 : 12}, 1fr)`} gap="20px" mt="20px">
        {/* Calendar */}

        <DashboardDataBox
          sx={{overflowX: 'scroll'}}
          gridColumn = {`span ${isMobile ? 1 : isTablet ? 2 : 8}`}>
           <Typography variant="h5" fontWeight="600" mb="15px">
            Event calendar
          </Typography>
          <Calendar />
      </DashboardDataBox>

        {/* Announcement Box */}

        
        <DashboardDataBox
        gridColumn = {`span ${isMobile ? 1 : isTablet ? 2 : 4}`} big>
            <Typography variant="h5" fontWeight="600" mb="15px">Announcements</Typography>
          {mockAnnouncements.map((announcement) => (
            <Card key={announcement.id} sx={{ mb: 2 }}>
              <CardContent sx={{ backgroundColor: conBg }}>
                <Typography variant="h6">{announcement.title}</Typography>
                <Typography variant="body2">{announcement.message}</Typography>
                <Typography variant="caption" color="gray">{announcement.date}</Typography>
              </CardContent>
            </Card>
          ))}
      </DashboardDataBox>

      </Box>

      {/* ROW 3 */}
      <Box display="grid" gridTemplateColumns={`repeat(${isMobile ? 1 : isTablet ? 2 : 12}, 1fr)`} gap="20px" mt="20px">
        {/* Top 5 Students by Activity */}

        <DashboardDataBox
        gridColumn = {`span ${isMobile ? 1 : isTablet ? 2 : 6}`}>
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
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Avatar
                src={student?.profilePicture}
                alt={`${student?.firstName} ${student?.lastName}`}
                sx={{ width: 50, height: 50, mr: 2 }}
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
      </DashboardDataBox>

        {/* Least Active Students */}

        
        <DashboardDataBox
        gridColumn = {`span ${isMobile ? 1 : isTablet ? 2 : 6}`}>
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
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Avatar
                src={student?.profilePicture}
                alt={`${student?.firstName} ${student?.lastName}`}
                sx={{ width: 50, height: 50, mr: 2 }}
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
      </DashboardDataBox>

      </Box>
    </Box>
  );
};

export default Instructor;