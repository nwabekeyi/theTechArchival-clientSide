import { Box, Button, useTheme, Rating, Typography } from '@mui/material';
import { tokens } from '../../theme';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import Header from '../../components/Header';
import Admin from './admin';
import Student from './student';
import Instructor from './instructor';
import { useSelector } from 'react-redux';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';

const Component = ({home}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useSelector((state) => state.users.user);

  const production = import.meta.env.EVN;

  return (
    <Box >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mx="10px">
        <Header title={user.firstName} subtitle="Welcome to your Babtech virtual learning dashboard" />
        <Box sx={{ display: 'flex' }}>
          {user.role === 'superadmin' && (
            <Button
              sx={{
                backgroundColor: colors.blueAccent[500],
                color: colors.grey[100],
                fontSize: '14px',
                fontWeight: 'bold',
                padding: '10px 20px',
              }}
            >
              <DownloadOutlinedIcon />
              Download Reports
            </Button>
          )}

          {user.role === 'instructor' && (
            <Box>
              <Rating value={user.rating} readOnly precision={0.1} />
              <Typography variant="h6">Rating: {user.rating}</Typography>
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


const MainComponent = withDashboardWrapper(Component)

const Dashboard = () =>{
    return(
        <div>
            <MainComponent home />
        </div>
    )
}


export default Dashboard;
