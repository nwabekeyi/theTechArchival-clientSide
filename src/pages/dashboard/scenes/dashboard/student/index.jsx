import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Card, CardContent, Avatar } from '@mui/material';
import { tokens } from '../../../theme';
import {
  mockResources,
} from '../../../data/mockData';
import SchoolIcon from '@mui/icons-material/School';
import ProgressCircle from '../../../components/ProgressCircle';
import useStudentData from './useStudentData';
import PerfromanceLineChart from './performanceChart';

const Student = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [resources, setResources] = useState([]);
  const { progressPercentage, attendanceRate, outstandings, nextClass, timeTableData, formatDateToDDMMYYYY } = useStudentData();

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

  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      if (isMounted) {
        setResources(mockResources);
      }
    }, 1000);

    return () => {
      isMounted = false;
    };
  }, []);

 
  const progressData = [
    { title: 'Course Progress', value: progressPercentage, details: 'Current course completion' },
    { title: 'Attendance Level', value: attendanceRate, details: 'Attendance percentage' },
  ];

  const conBg = `${theme.palette.mode === "light" ? colors.blueAccent[800] : colors.greenAccent[600]} !important`

  return (
    <Box>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
        {/* FIRST ROW */}
        <Box gridColumn="span 12" display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="20px">
          {progressData.map((progress, index) => (
            <Box key={index} display="flex" flexDirection="column" alignItems="center" gap="10px">
              <Box
                backgroundColor={colors.primary[400]}
                p="10px"
                borderRadius="10px"
                textAlign="center"
                width="100%"
                height="100%"
              >
                <Typography variant="h6" fontWeight="600" mb="5px">
                  {progress.title}
                </Typography>
                <ProgressCircle size="125" progress={progress.value} />
                <Typography variant="body2" mt="10px">
                  {progress.details}: {progress.value}%
                </Typography>
              </Box>
            </Box>
          ))}
          <Box display="flex" flexDirection="column" alignItems="center" gap="10px">
            <Box
              backgroundColor={colors.primary[400]}
              p="10px"
              borderRadius="10px"
              textAlign="center"
              width="100%"
              height="100%"
            >
              <Typography variant="h6" fontWeight="600" mb="5px">
                Payment Rate ({parseInt(100 - outstandings.percentageDifference)}%)
              </Typography>
              <ProgressCircle size="125" progress={parseInt(100 - outstandings.percentageDifference)} />
              <Typography variant="body2" mt="10px">
                Outstanding Payments: {outstandings.totalOutstanding}
              </Typography>
            </Box>
          </Box>
          {/* Next Lecture */}
          <Box display="flex" flexDirection="column" alignItems="center" gap="10px">
            <Box
              backgroundColor={colors.primary[400]}
              p="10px"
              borderRadius="10px"
              width="100%"
              height="100%"
            >
              <Typography variant="h6" fontWeight="600" mb="5px" textAlign="center">
                Next Class
              </Typography>
              {nextClass ? (
                <Box textAlign="center">
                  <SchoolIcon sx={{ fontSize: '30px', color: colors.blueAccent[400] }} />
                  <Typography variant="h6">{nextClass.topic}</Typography>
                  <Typography>{nextClass.date}</Typography>
                  <Typography>{nextClass.time}</Typography>
                  <Typography>Location: {nextClass.location}</Typography>
                </Box>
              ) : (
                <Typography>No upcoming lectures.</Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* SECOND ROW */}
        <Box gridColumn="span 12" display="flex" gap="20px" sx={{ height: '350px' }}>
          <Box flex={2} backgroundColor={colors.primary[400]} p="20px" sx={{ overflowY: 'auto', width: "100%" }}                 
          borderRadius="10px"
          >
            <PerfromanceLineChart />
          </Box>

          {/* Upcoming Schedule */}
          <Box flex={1} backgroundColor={colors.primary[400]} p="20px" sx={{ overflowY: 'auto', width: "100%" }}                 
          borderRadius="10px"
          >
            <Typography variant="h5" fontWeight="600" mb="15px">
              Upcoming Schedule
            </Typography>

            {timeTableData && timeTableData.length > 0 ? (
              timeTableData
                .filter((schedule) => {
                  const scheduleDateTime = new Date(`${schedule.date.substring(0, 10)}T${schedule.time}`);
                  return scheduleDateTime > new Date(); // Only include upcoming schedules
                })
                .sort((a, b) => {
                  const dateA = new Date(`${a.date.substring(0, 10)}T${a.time}`);
                  const dateB = new Date(`${b.date.substring(0, 10)}T${b.time}`);
                  return dateA - dateB; // Sort by date and time
                })
                .map((schedule) => (
                  <Card key={schedule.id} sx={{ mb: 2 }}>
                    <CardContent sx={{backgroundColor: conBg}}>
                      <Typography variant="h6">{schedule.topic}</Typography>
                      <Typography>{formatDateToDDMMYYYY(schedule.date)}</Typography>
                      <Typography>{schedule.time}</Typography>
                      <Typography>Location: {schedule.location}</Typography>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <Typography variant="body1">No timetable found</Typography>
            )}
          </Box>

        </Box>

        {/* THIRD ROW (MESSAGES + INSTRUCTOR PROFILE) */}
        <Box gridColumn="span 12" display="flex" gap="20px" sx={{ height: '300px' }}>
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

         {/* Useful Resources */}
         <Box
            flex={1}
            backgroundColor={colors.primary[400]}
            p="20px"
            sx={{ overflowY: 'auto' }}
            borderRadius="10px"

          >
            <Typography variant="h5" fontWeight="600" mb="15px">
              Useful Resources
            </Typography>
            {resources.map((res, i) => (
              <Card key={i} sx={{ mb: 2 }}>
                <CardContent sx={{backgroundColor: conBg}}>
                  <Typography variant="h6">{res.title}</Typography>
                  <a href={res.link} target="_blank" rel="noopener noreferrer">
                    {res.link}
                  </a>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        
      </Box>
    </Box>
  );
};

export default Student;
