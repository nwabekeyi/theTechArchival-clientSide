import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Avatar,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button
} from '@mui/material';
import { Message } from '@mui/icons-material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import { endpoints } from '../../../../utils/constants';
import useApi from '../../../../hooks/useApi';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import the eye icon
import { tokens } from '../../theme';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';

const StudentManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useSelector((state) => state.users.user);
  const { callApi, loading, data } = useApi();
  const [students, setStudents] = useState([]);

  useEffect(async () => {
    const studentData = await callApi(`${endpoints.COHORT}/students/${user.cohort}`);
    if (studentData && studentData.students) {
      setStudents(studentData.students);
    }
  }, []);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState(''); // 'message' or 'details'
  const [message, setMessage] = useState('');

  const handleOpenDialog = (student, mode) => {
    console.log(student)
    setSelectedStudent(student);
    setDialogMode(mode);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMessage('');
  };

  const handleSendMessage = () => {
    console.log(`Message to ${selectedStudent.name}: ${message}`);
    handleCloseDialog();
  };

  return (
    <Box>
      <Grid item xs={12}>
        <Header title='Student Management' subtitle='Manage Students' />
      </Grid>

      <Grid container spacing={2}>
        {students.length && students.map((student) => (
          <Grid item xs={12} md={6} key={student.studentId}>
            <Accordion sx={{ backgroundColor: colors.primary[400], mb: 0}}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${student.firstName}-${student.lastName}`.toLowerCase()}
                id={`${student.firstName}-${student.lastName}`.toLowerCase()}
              >
                <Box sx={{display: 'flex', alignItems:"center"}}
                >
                <Avatar
                  alt={`${student.firstName} ${student.lastName}`}
                  src={student.profilePicture}
                  style={{ marginRight: 10 }}
                />
                <Typography >{`${student.firstName} ${student.lastName}`}</Typography>
                </Box>

              </AccordionSummary>

              <AccordionDetails sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                <Box>
                <Typography variant="body1">Student ID: {selectedStudent?.studentId || 'Not provided'}</Typography>
            <Typography variant="body2">Activity rate: {selectedStudent?.activityRate || 'Not provided'}</Typography>
                </Box>

                <IconButton edge="end" aria-label="view details" onClick={() => handleOpenDialog(student, 'details')}>
                  <VisibilityIcon />
                </IconButton>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      <Modal
  open={openDialog}
  onClose={handleCloseDialog}
  title={dialogMode === 'message' ? `Message to ${selectedStudent?.firstName}` : 'Student Details'}
  onConfirm={handleSendMessage}
  confirmMessage="Send"
  noConfirm={dialogMode === 'details'}
>
  {dialogMode === 'message' ? (
    <TextField
      label="Message"
      variant="outlined"
      multiline
      rows={4}
      fullWidth
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
        },
        '& .MuiInputLabel-root': {
          color: 'text.secondary',
        },
      }}
    />
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', width: '100%'}}>
     
     <Box sx={{flex: 1}}>
     <img
        src={selectedStudent?.profilePicture}
        alt="Profile"
        style={{ maxWidth: '100%', height: '100%', borderRadius: '10px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}
      />
     </Box>
     
      <Box sx={{ textAlign: 'left'}}>
        <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
          {`${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.8rem', mt: 1 }}>
          <span style={{ fontWeight: 'bold', color: '#555' }}>Student ID: </span>
          {selectedStudent?.studentId || 'Not provided'}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.8rem', mt: 1 }}>
          <span style={{ fontWeight: 'bold', color: '#555' }}>Email: </span>
          {selectedStudent?.email || 'Not provided'}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.8rem', mt: 1 }}>
          <span style={{ fontWeight: 'bold', color: '#555' }}>Phone Number: </span>
          {selectedStudent?.phoneNumber || 'Not provided'}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.8rem', mt: 1 }}>
          <span style={{ fontWeight: 'bold', color: '#555' }}>Activity Rate: </span>
          {selectedStudent?.activityRate || 'Not provided'}
        </Typography>

        {/* Message Icon */}
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', mt: 2 }}>
          <Message
            title="Send a message"
            sx={{ fontSize: 36, cursor: 'pointer', color: 'secondary.main', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </Box>
      </Box>
    </Box>
  )}
</Modal>


    </Box>
  );
};

export default withDashboardWrapper(StudentManagement);
