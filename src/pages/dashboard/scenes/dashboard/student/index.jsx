import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
  Avatar,
  Grid,
} from "@mui/material";
import { tokens } from "../../../theme";
import { mockResources } from "../../../data/mockData";
import SchoolIcon from "@mui/icons-material/School";
import ProgressCircle from "../../../components/ProgressCircle";
import useStudentData from "./useStudentData";
import PerfromanceLineChart from "./performanceChart";

const Student = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [resources, setResources] = useState([]);
  const { progressPercentage, attendanceRate, outstandings, nextClass, timeTableData, formatDateToDDMMYYYY } = useStudentData();

  const mockAnnouncements = [
    {
      id: 1,
      title: "New Semester Starts",
      message: "The new semester starts on January 15th. Please review your schedule.",
      date: "2024-12-22",
    },
    {
      id: 2,
      title: "Maintenance Window",
      message: "Scheduled maintenance will occur on December 24th. Plan accordingly.",
      date: "2024-12-22",
    },
    {
      id: 3,
      title: "Holiday Break",
      message: "Holiday break starts on December 23rd. Classes resume January 10th.",
      date: "2024-12-22",
    },
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
    { title: "Course Progress", value: progressPercentage, details: "Current course completion" },
    { title: "Attendance Level", value: attendanceRate, details: "Attendance percentage" },
  ];

  const conBg = `${
    theme.palette.mode === "light" ? colors.blueAccent[800] : colors.greenAccent[600]
  } !important`;

  return (
    <Box
    >
      <Grid container spacing={2}>
        {/* FIRST ROW */}
        <Grid container item xs={12} spacing={2}>
          {progressData.map((progress, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                backgroundColor={colors.primary[400]}
                p="10px"
                borderRadius="10px"
                textAlign="center"
                display="flex" 
                flexDirection= "column"
                justifyContent="center" 
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="600" mb="5px">
                  {progress.title}
                </Typography>
                <ProgressCircle size="125" progress={progress.value} />
                <Typography variant="body2" mt="10px">
                  {progress.details}: {progress.value}%
                </Typography>
              </Box>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              backgroundColor={colors.primary[400]}
              p="10px"
              borderRadius="10px"
              textAlign="center"
              display="flex" 
                flexDirection= "column"
                justifyContent="center" 
                alignItems="center"
            >
              <Typography variant="h6" fontWeight="600" mb="5px">
                Payment Rate ({parseInt(100 - outstandings.percentageDifference)}%)
              </Typography>
              <ProgressCircle
                size="125"
                progress={parseInt(100 - outstandings.percentageDifference)}
              />
              <Typography variant="body2" mt="10px">
                Outstanding Payments: {outstandings.totalOutstanding}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              backgroundColor={colors.primary[400]}
              p="10px"
              borderRadius="10px"
              textAlign="center"
              height='100%'
            >
              <Typography variant="h6" fontWeight="600" mb="5px">
                Next Class
              </Typography>
              {nextClass ? (
                <Box textAlign="center">
                  <SchoolIcon sx={{ fontSize: "30px", color: colors.blueAccent[400] }} />
                  <Typography variant="h6">{nextClass.topic}</Typography>
                  <Typography>{nextClass.date}</Typography>
                  <Typography>{nextClass.time}</Typography>
                  <Typography>Location: {nextClass.location}</Typography>
                </Box>
              ) : (
                <Typography>No upcoming lectures.</Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* SECOND ROW */}
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12} md={8}>
            <Box
              backgroundColor={colors.primary[400]}
              p="20px"
              sx={{ overflowY: "auto", height: "350px" }}
              borderRadius="10px"
            >
              <PerfromanceLineChart />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              backgroundColor={colors.primary[400]}
              p="20px"
              sx={{ overflowY: "auto", height: "350px" }}
              borderRadius="10px"
            >
              <Typography variant="h5" fontWeight="600" mb="15px">
                Upcoming Schedule
              </Typography>
              {timeTableData && timeTableData.length > 0 ? (
                timeTableData.map((schedule) => (
                  <Card key={schedule.id} sx={{ mb: 2 }}>
                    <CardContent sx={{ backgroundColor: conBg }}>
                      <Typography variant="h6">{schedule.topic}</Typography>
                      <Typography>{formatDateToDDMMYYYY(schedule.date)}</Typography>
                      <Typography>{schedule.time}</Typography>
                      <Typography>Location: {schedule.location}</Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography>No timetable found</Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* THIRD ROW */}
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              backgroundColor={colors.primary[400]}
              p="20px"
              sx={{ overflowY: "auto", height: "300px" }}
              borderRadius="10px"
            >
              <Typography variant="h5" fontWeight="600" mb="15px">
                Announcements
              </Typography>
              {mockAnnouncements.map((announcement) => (
                <Card key={announcement.id} sx={{ mb: 2 }}>
                  <CardContent sx={{ backgroundColor: conBg }}>
                    <Typography variant="h6">{announcement.title}</Typography>
                    <Typography variant="body2">{announcement.message}</Typography>
                    <Typography variant="caption" color="gray">
                      {announcement.date}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              backgroundColor={colors.primary[400]}
              p="20px"
              sx={{ overflowY: "auto", height: "300px" }}
              borderRadius="10px"
            >
              <Typography variant="h5" fontWeight="600" mb="15px">
                Useful Resources
              </Typography>
              {resources.map((res, i) => (
                <Card key={i} sx={{ mb: 2 }}>
                  <CardContent sx={{ backgroundColor: conBg }}>
                    <Typography variant="h6">{res.title}</Typography>
                    <a href={res.link} target="_blank" rel="noopener noreferrer">
                      {res.link}
                    </a>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Student;
