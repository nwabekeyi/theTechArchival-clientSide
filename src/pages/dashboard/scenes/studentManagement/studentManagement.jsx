import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Grid,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  useTheme
} from '@mui/material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import { endpoints } from '../../../../utils/constants';
import useApi from '../../../../hooks/useApi';
import { useSelector } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import the eye icon
import { tokens } from '../../theme';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';

const StudentManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useSelector((state) => state.users.user);
  const { callApi, loading, data } = useApi();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    callApi(`${endpoints.COHORT}/students/${user.cohort}`);
  }, []);

  useEffect(() => {
    if (data) {
      // Map the API data to the student list with profile picture
      const studentData = data.students.map((student) => ({
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        profilePictureUrl: student.profilePictureUrl,
      }));
      setStudents(studentData);
    }
  }, [data]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState(''); // 'message' or 'details'
  const [message, setMessage] = useState('');

  const handleAddStudent = () => {
    // Implement logic to add a new student
  };

  const handleDeleteStudent = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
  };

  const handleOpenDialog = (student, mode) => {
    setSelectedStudent(student);
    setDialogMode(mode);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMessage('');
  };

  const handleSendMessage = () => {
    // Implement logic to send message
    console.log(`Message to ${selectedStudent.name}: ${message}`);
    handleCloseDialog();
  };

  return (
    <Box>
      <Grid item xs={12}>
        <Header
          title='Student Management'
          subtitle= 'Manage Students'
        />
      </Grid>
        <Box>
          <List 
          sx={{ backgroundColor : colors.primary[400], color: colors.greenAccent[500]}}
          >
            {students.map((student) => (
              <ListItem key={student.id}

              >
                <Avatar
                  alt={student.name}
                  src={student.profilePictureUrl}
                  style={{ marginRight: 10 }}
                />
                <ListItemText primary={student.name} secondary={student.email} />
                <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteStudent(student.id)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="message" onClick={() => handleOpenDialog(student, 'message')}>
                    <Typography>Message</Typography>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
      </Box>
     
      <Modal
        open={openDialog}
        onClose={handleCloseDialog}
        title={dialogMode === 'message' ? `Message to ${selectedStudent?.name}` : 'Student Details'}
        onConfirm={handleSendMessage}
        confirmMessage="Send"
        noConfirm={dialogMode === 'details'}
      >
        {dialogMode === 'message' ? (
          <>
            <TextField
              label="Message"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </>
        ) : (
          <>
            <Typography variant="h6">Name: {selectedStudent?.name}</Typography>
            <Typography variant="body1">Email: {selectedStudent?.email}</Typography>
            <Typography variant="body2">Cohort: {selectedStudent?.cohort}</Typography>
            <img src={selectedStudent?.profilePictureUrl} alt="Profile" style={{ maxWidth: 200, marginTop: 10 }} />
          </>
        )}
      </Modal>
    </Box>
  );
};

export default withDashboardWrapper(StudentManagement);
