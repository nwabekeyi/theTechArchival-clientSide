import { Box, Button, useTheme, Rating, Typography } from '@mui/material';
import { tokens } from '../../theme';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import Header from '../../components/Header';
import Admin from './admin';
import Student from './student';
import Instructor from './instructor';
import { useSelector } from 'react-redux';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import { useState } from 'react';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { MakeAnnouncement } from './modals';

const Component = ({home}) => {
  const [openAnouncementModal, setOpenAnouncementModal] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useSelector((state) => state.users.user);

  return (
    <Box >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={user.firstName} subtitle="Welcome to your Babtech virtual learning dashboard" />
        <Box sx={{ display: 'flex' }}>
          {user.role === 'superadmin' && (
        <Box 
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'column', md: 'row' }, // Column layout on small and medium screens, row on larger screens
          alignItems: 'center',  // Align center
          justifyContent: 'center',  // Justify center
          gap: '10px', // Optional: Adds some space between items
        }}
      >
        <Button
          sx={{
            backgroundColor: theme.palette.mode === 'light' ? colors.blueAccent[500] : colors.greenAccent[600],
            color: theme.palette.mode === 'light' ? colors.grey[900] : colors.grey[100],
            fontSize: { xs: '6px', sm: '10px', md: '12px' }, // Responsive font size
            fontWeight: 'bold',
            width: { xs: '100%', sm: '130px', md: '160px', lg: '180px' }, // Responsive width for consistent size
            height: { xs: '30px', sm: '40px', md: '50px' }, // Responsive width for consistent size
            boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)', // Lighter shadow for light mode
          }}
        >
          <DownloadOutlinedIcon sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' } }} />
          Download Reports
        </Button>

        <Button
          onClick={() => setOpenAnouncementModal(true)}
          sx={{
            backgroundColor: theme.palette.mode === 'light' ? colors.blueAccent[500] : colors.greenAccent[600],
            color: theme.palette.mode === 'light' ? colors.grey[900] : colors.grey[100],
            fontSize: { xs: '6px', sm: '10px', md: '12px' }, // Responsive font size
            fontWeight: 'bold',
            width: { xs: '100%', sm: '130px', md: '160px', lg: '180px' }, // Responsive width for consistent size
            height: { xs: '30px', sm: '40px', md: '50px' }, // Responsive width for consistent size
            boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)', // Lighter shadow for light mode
          }}
        >
          <AnnouncementIcon sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' } }} />
          Make announcement
        </Button>
      
        {/* Make Announcement modal */}
        <MakeAnnouncement
          openAnnoucementModal={openAnouncementModal}
          setModalOpen={setOpenAnouncementModal}
        />
      </Box>
      
          )}

          {user.role === 'instructor' && (
            <Box>
              <Rating sx={{ fontSize: { xs: '1em', sm: '1.2em' } }} value={user.rating} readOnly precision={0.1} />
              <Typography variant="h6" sx={{ fontSize: { xs: '0.8em', sm: '1em' } }}>
                Rating: {user.rating}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      {user.role === 'admin' || user.role === 'superadmin' ? (
        <Admin user={user} />
      ) : user.role === 'student' ? (
        <Student user={user} />
      ) : user.role === 'instructor' ? (
        <Instructor user={user} />
      ) : null}
    </Box>
  );
};

const MainComponent = withDashboardWrapper(Component);

const Dashboard = () => {
  return (
    <div>
      <MainComponent home />
    </div>
  );
};

export default Dashboard;
