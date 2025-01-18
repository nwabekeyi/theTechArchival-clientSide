import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Tooltip, IconButton, Typography } from '@mui/material';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import the eye icon
import { useSelector } from 'react-redux';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import Loader from "../../../../utils/loader";

const Assignment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false); // New state for file submission modal
  const [newAssignment, setNewAssignment] = useState({ title: '', dueDate: '', description: '' });
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { loading, error, data, callApi } = useApi();
  const { loading:postAssignmentLoad, error:postAssignmentError, data:postAssignmentData, callApi:postAssignment } = useApi();
  console.log(assignments)

  const userDetails = useSelector((state) => state.users.user);
  const cohortName = userDetails.cohort;
  const postUrl = `${endpoints.ASSIGNMENT}/${cohortName}`;
  console.log(selectedAssignment)

  // Use effect to fetch schedules
  useEffect(() => {
    if (postUrl) {
      callApi(postUrl, 'GET');
    }
  }, [postUrl, callApi]);

  // Update timetable when data is available
  useEffect(() => {
    if (data) {
      setAssignments(data);
    }
  }, [data]);

  const refinedAssignments = assignments.map((assignment, index) => {
    return {
      id: index + 1,
      title: assignment.title,
      dueDate: assignment.dueDate,
      description: assignment.description,
      assignemntId: assignment.id
    };
  });

  const handleOpenModal = (assignment = null) => {
    if (assignment) {
      setSelectedAssignment(assignment);
    } else {
      setSelectedAssignment(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenSubmitModal = (assignment = null) => {
    setSelectedAssignment(assignment);
    setOpenSubmitModal(true);
  };

  const handleCloseSubmitModal = () => {
    setOpenSubmitModal(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the uploaded file
  };

  const handleFileSubmit = (assignemntId) => {
    if (file) {
      const formData = new FormData();
      formData.append('submission', file); // Append the file to formData
      formData.append('studentId', userDetails.studentId); // Append the studentId
      // Logic for file submission (e.g., uploading to server)
      postAssignment(`${endpoints.ASSIGNMENT}/submissions/${userDetails.cohort}/${assignemntId}`, 'PATCH', formData)
    };

    handleCloseSubmitModal();
  };

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: 'Title' },
    { id: 'dueDate', label: 'Due Date' },
    { id: 'description', label: 'Description' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => (
        <>
          <Tooltip title="View assignment">
            <IconButton onClick={() => handleOpenModal(row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Submit assignment">
            <Button onClick={() => {handleOpenSubmitModal(row)}} variant="contained" color="primary">
              Submit
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleRowClick = (row) => {
    console.log(row);
  };

  return (
    <Box m="20px">
      <Header title="ASSIGNMENTS" subtitle="Overview of Assignments" />
      {loading ? (
        <Loader />
      ) : (
        <Box m="40px 0 0 0" height="75vh">
          <TableComponent
            columns={columns}
            tableHeader="Overview of Assignments"
            data={refinedAssignments}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRowClick={handleRowClick}
          />
        </Box>
      )}

      {/* Modal to view assignment details */}
      <Modal open={openModal} onClose={handleCloseModal} title="View Assignment Details" onConfirm={handleCloseModal}>
        {selectedAssignment && (
          <Box>
            <Typography variant="h6">Title: {selectedAssignment.title}</Typography>
            <Typography variant="body1">Due Date: {selectedAssignment.dueDate}</Typography>
            <Typography variant="body2">Description: {selectedAssignment.description}</Typography>
          </Box>
        )}
      </Modal>

      {/* Modal to submit assignment as a file */}

      <Modal open={openSubmitModal} onClose={handleCloseSubmitModal} title={selectedAssignment && `Submit assignment for ${selectedAssignment.title}`} onConfirm={() => {handleFileSubmit(selectedAssignment.id)}}>
        <Box display="flex" flexDirection="column" gap="20px">
          <input type="file" onChange={handleFileChange} />
          <Button variant="contained" color="primary" onClick={() => {handleFileSubmit(selectedAssignment.assignemntId)}}>
            Submit Assignement
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Assignment;
