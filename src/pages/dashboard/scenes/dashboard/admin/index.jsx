import { Box, Typography, useTheme, Avatar } from '@mui/material';
import { tokens } from '../../../theme';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import StatBox from '../../../components/StatBox';
import LineChart from '../../../components/LineChart';
import useAdminData from './useAdminData';
import { useState, useEffect } from 'react';
import Loader from '../../../../../utils/loader';
import ProgressCircle from '../../../components/ProgressCircle';

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState(0);
  const [instructors, setInstructors] = useState(0);
  const { usersData, totalRevenue, programStats, topInstructors, outstandingPayments, mockCohorts } = useAdminData();

  useEffect(() => {
    if (usersData) {
      setLoading(false);
      setInstructors(usersData.instructors?.length || 0);
      setStudents(usersData.students?.length || 0);
    }
  }, [usersData]);

  const conBg = `${theme.palette.mode === "light" ? colors.grey[800] : colors.greenAccent[700]} !important`;

  if (!usersData) {
    return <Loader />;
  } else {
    // Sort courses by student count in descending order
    const sortedProgramStats = Object.keys(programStats)
      .map((program) => ({
        program,
        ...programStats[program],
      }))
      .sort((a, b) => b.studentCount - a.studentCount); // Sorting by student count

    return (
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* UI components */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ borderRadius: '10px'}}

        >
          <StatBox
            figure={students}
            subtitle="Students"
            icon={<GroupsIcon sx={{ fontSize: '100%' }} />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ borderRadius: '10px'}}

        >
          <StatBox
            figure={instructors}
            subtitle="Instructors"
            icon={<SchoolIcon sx={{ fontSize: '100%' }} />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ borderRadius: '10px'}}

        >
          <StatBox
            figure={usersData.studentsIn24Hrs || 0}
            subtitle="New Students"
            icon={<PersonAddIcon sx={{ fontSize: '100%' }} />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ borderRadius: '10px'}}

        >
          <StatBox
            figure="2"
            subtitle="Unread Enquiries"
            icon={<EmailIcon sx={{ fontSize: '100%' }} />}
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ borderRadius: '10px'}}

          >
            <Box p="10px 0">
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Revenue Generated
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {`₦${totalRevenue}`}
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/* Outstanding Payments */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderRadius: '10px'}}

        >
          <Typography variant="h5" fontWeight="600" pb="30px">
            Outstanding Payments
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
            mb="25px"
          >
            <ProgressCircle
              size="125"
              progress={outstandingPayments.totalOutstanding > 0 ? ((outstandingPayments.totalOutstanding / totalRevenue) * 100).toFixed(2) : 0}
            />
            <Typography
              variant="h5"
              color={colors.blueAccent[500]}
              sx={{ pt: '20px' }}
            >
              ₦{outstandingPayments.totalOutstanding} outstanding payment
            </Typography>
            <Typography>
              {outstandingPayments.totalOutstanding > 0 ? ((outstandingPayments.totalOutstanding / totalRevenue) * 100).toFixed(2) : 0}% of total expected payments
            </Typography>
          </Box>
        </Box>

        {/* ROW 3 - Cohorts, Course Stats, Top Instructors */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          overflow="auto"
          p="15px"
        >
          <Typography variant="h5" fontWeight="600" gutterBottom>
            Courses Stats
          </Typography>

          {sortedProgramStats.map(({ program, studentCount, totalAmount }) => (
            <Box
              key={program}
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              p="15px"
              mb="10px"
              sx={{backgroundColor: conBg, borderRadius: '10px'}}
            >
              {/* Avatar for Program */}
              <Avatar>{program.charAt(0)}</Avatar>

              {/* Program Details */}
              <Box display="flex" flexDirection="column" ml="15px">
                <Typography variant="h6" fontWeight="600">
                  {program}
                </Typography>
                <Typography variant="body1">Students: {studentCount}</Typography>
                <Typography variant="body1">Total Revenue: ₦{totalAmount}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Top Instructors */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          overflow="auto"
          p="15px"
        >
          <Typography variant="h5" fontWeight="600" gutterBottom>
            Top Instructors
          </Typography>

          {topInstructors.map((instructor) => (
            <Box
              key={instructor.firstName + instructor.lastName}
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              p="15px"
              mb="10px"
              sx={{backgroundColor: conBg, borderRadius: '10px'}}
            >
              {/* Avatar for Instructor */}
              <Avatar src={instructor.profilePictureUrl}>{instructor.firstName.charAt(0)}</Avatar>

              {/* Instructor Details */}
              <Box display="flex" flexDirection="column" ml="15px">
                <Typography variant="h6" fontWeight="600">
                  {instructor.firstName} {instructor.lastName}
                </Typography>
                <Typography variant="body1">Rating: {instructor.rating}</Typography>
                <Typography variant="body1">Program: {instructor.program}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Cohorts Box */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          overflow="auto"
          p="15px"
          sx={{ backgroundColor: colors.blueAccent[900], borderRadius: '10px' }}

        >
          <Typography variant="h5" fontWeight="600" gutterBottom>
            Cohorts
          </Typography>
          {mockCohorts.map((cohort, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              p="15px"
              mb="10px"
            >
              <Typography variant="h6" fontWeight="600">
                {cohort.name}
              </Typography>
              <Typography variant="body1">Course: {cohort.courseName}</Typography>
              <Typography variant="body1">Number of Students: {cohort.numStudents}</Typography>
              <Typography variant="body1">Progress: {cohort.progress}%</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
};

export default Admin;
