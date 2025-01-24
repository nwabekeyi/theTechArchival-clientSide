import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table';
import useApi from '../../../../hooks/useApi'; // Import your custom hook
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';


const Feedbacks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  const [comments, setComments] = useState('');

  // Using useApi for fetching feedbacks and submitting new feedback
  const {
    loading: fetchLoading,
    data: fetchData,
    error: fetchError,
    callApi: fetchFeedbacks,
  } = useApi('http://localhost:3500/api/v1/feedbacks');

  const {
    loading: submitLoading,
    error: submitError,
    callApi: submitFeedback,
  } = useApi('http://localhost:3500/api/v1/feedbacks');

  // Fetch feedbacks when the component mounts
  useEffect(() => {
    fetchFeedbacks('GET');
  }, [fetchFeedbacks]);

  // Update feedbacks state when data is fetched
  useEffect(() => {
    if (fetchData) {
      setFeedbacks(fetchData);
    }
  }, [fetchData]);

  // Handle form submission to save feedback to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFeedback = { name, role, date, comments };

    await submitFeedback('POST', newFeedback);

    if (!submitError) {
      // Update feedback list with the newly added feedback
      setFeedbacks((prevFeedbacks) => [...prevFeedbacks, newFeedback]);
      setName('');
      setRole('');
      setDate('');
      setComments('');
    }
  };

  const columns = [
    { id: 'id', label: 'ID', flex: 0.5 },
    { id: 'name', label: 'Name', flex: 1 },
    { id: 'role', label: 'Role', flex: 1 },
    { id: 'date', label: 'Date', flex: 1 },
    { id: 'comments', label: 'Comments', flex: 2 },
  ];

  const handleSortChange = (columnId) => {
    // handle sort change logic
  };

  const handlePageChange = (event, newPage) => {
    // handle page change logic
  };

  const handleRowsPerPageChange = (event) => {
    // handle rows per page change logic
  };

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
  };

  const tableProps = {
    columns,
    tableHeader: 'Feedback',
    data: feedbacks,
    sortBy: 'id',
    sortDirection: 'asc',
    onSortChange: handleSortChange,
    page: 0,
    rowsPerPage: 5,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    onRowClick: handleRowClick,
  };

  return (
    <Box>
      <Header title="Feedback" subtitle="Feedback from Students, Instructors, and Workers" />

      {fetchLoading && <Typography>Loading feedbacks...</Typography>}
      {fetchError && <Typography color="error">{fetchError}</Typography>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 3 }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="instructor">Instructor</MenuItem>
            <MenuItem value="worker">Worker</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={submitLoading}
        >
          {submitLoading ? 'Submitting...' : 'Submit Feedback'}
        </Button>
        {submitError && <Typography color="error">{submitError}</Typography>}
      </Box>

      <Box
        height="75vh"
        sx={{
          '& .MuiTable-root': {
            border: 'none',
          },
          '& .MuiTable-cell': {
            borderBottom: 'none',
          },
          '& .MuiTableHead-root': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiTableBody-root': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiTableFooter-root': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <TableComponent {...tableProps} />
      </Box>
    </Box>
  );
};

export default withDashboardWrapper(Feedbacks);
