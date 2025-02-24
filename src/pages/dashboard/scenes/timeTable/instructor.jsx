import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table';
import { tokens } from '../../theme';
import useApi from '../../../../hooks/useApi';
import { useSelector } from 'react-redux';
import { endpoints } from '../../../../utils/constants';
import ConfirmationModal from '../../components/confirmationModal';
import CustomIconButton from '../../components/customIconButton';
import EditIcon from '@mui/icons-material/Edit';
import ActionButton from '../../components/actionButton';


const Instructor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({ date: '', course: '', time: '', location: '', topic: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [deleteConfirm, setDeleteConfrim] = useState(false);
  const [updateConfirm, setUpdateConfrim] = useState(false)


  const userDetails = useSelector((state) => state.users.user);
  const cohortName = userDetails.cohort;
  const postUrl = `${endpoints.TIMETABLE}/${cohortName}`;

  //handle confirm modal close
  const handleConfirmModalClose = () => {
    if(deleteConfirm === true){
      setDeleteConfrim(false);
    };

    if(updateConfirm === true){
      setUpdateConfrim(false);
    }
  };

  const { loading: postLoading, data: postData, error: postError, callApi: postCallApi } = useApi();
  const { loading: getLoading, error: getError, callApi: getCallApi } = useApi();
  const { loading: putLoading, data: putData, error: putError, callApi: putCallApi } = useApi();
  const { loading: deleteLoading, data: deleteData, error: deleteError, callApi: deleteCallApi } = useApi();

  useEffect(() => {
    const fetchSchedules = async () => {
      if (postUrl) {
        const data = await getCallApi(postUrl, 'GET');
        setSchedules(data);
      }
    };

    fetchSchedules();
  }, []);

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return 'Invalid Date';
  
    const formattedDate = new Date(dateStr).toISOString().split('T')[0];
    const scheduleDateTime = new Date(`${formattedDate}T${timeStr}`);
  
    if (isNaN(scheduleDateTime)) {
      return 'Invalid Date';
    }
  
    return scheduleDateTime; // Return the Date object for comparison
  };
  
  const columns = [
    {
      id: 'date',
      label: 'Date',
      renderCell: (row) => formatDateTime(row.date, row.time).toLocaleDateString(), // Format date for display
    },
    { id: 'time', label: 'Time' },
    { id: 'location', label: 'Location' },
    { id: 'topic', label: 'Topic' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => {
        const scheduleDateTime = formatDateTime(row.date, row.time); // Get the scheduled date and time
        const currentDateTime = new Date(); // Get the current date and time
  
        const isPast = scheduleDateTime <= currentDateTime; // Check if the scheduled time is in the past
  
        return (
          <>
              < CustomIconButton
                onClick={() => handleEdit(row)}
                icon= {<EditIcon />}
              />
            <Button
            sx={{
              fontSize: { xs: '0.5rem', sm: '0.7rem' },  // Smaller font on small screens
              padding: { xs: '4px', sm: '8px' },  // Adjust padding for small screens
              minWidth: { xs: '50px', sm: '70px' },  // Reduce width on small screens
              ml: 1
            }}
              variant="contained"
              color={isPast ? 'success' : 'secondary'} // Change color if past
              onClick={() => (handleDelete(row))}
            >
              {isPast ? 'Mark as Done' : 'Delete'} {/* Change text conditionally */}
            </Button>
          </>
        );
      },
    },
  ];


  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setFormData({ date: '', course: '', time: '', location: '', topic: '' });
    setEditingSchedule(null);
  };

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setScheduleToDelete(null);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);

    // Set form data to existing values of the selected schedule
    setFormData({
      date: schedule.date || '',
      time: schedule.time || '',
      location: schedule.location || '',
      topic: schedule.topic || '',
      course: schedule.course || '',
    });

    handleOpenEditModal();
  };

  const handleUpdate = async () => {
    if (editingSchedule) {
      const updatedSchedule = {
        date: formData.date,
        time: formData.time,
        location: formData.location,
        topic: formData.topic,
        course: formData.course,
      };

      const response = await putCallApi(`${postUrl}/${editingSchedule.id}`, 'PUT', updatedSchedule);

      // If update is successful, update the schedules state
      if (response) {
        setSchedules((prevSchedules) =>
          prevSchedules.map((schedule) =>
            schedule.id === editingSchedule.id ? { ...schedule, ...updatedSchedule } : schedule
          )
        );
        setUpdateConfrim(true);

      }else{
        setUpdateConfrim(true);

      }

      handleCloseEditModal();
    }
  };

  const handleDelete = (schedule) => {
    setEditingSchedule(schedule);
    handleOpenDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (editingSchedule) {
      const response = await deleteCallApi(`${postUrl}/${editingSchedule.id}`, 'DELETE');

      // If deletion is successful, remove the schedule from the state
      if (response) {
        setSchedules((prevSchedules) =>
          prevSchedules.filter((schedule) => schedule.id !== editingSchedule.id)
        );
      }else{
        setDeleteConfrim(true);
      }

      handleCloseDeleteModal();
      setDeleteConfrim(true);
    }
  };

  const handleSubmit = async () => {
    const newSchedule = {
      date: formData.date,
      time: formData.time,
      location: formData.location,
      topic: formData.topic,
      course: formData.course,
    };

    const response = await postCallApi(postUrl, 'POST', newSchedule);

    // If post is successful, add the new schedule to the state
    if (response) {
      setSchedules(response.timetable);
    }

    handleCloseEditModal();
  };

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box>
      <Header title="TIME TABLE" subtitle="Overview of Weekly Schedule" />

      <ActionButton 
        onClick={handleOpenEditModal}
        content= 'Add Schedule'
      />


      <TableComponent
        columns={columns}
        data={schedules}
        page={page}
        rowsPerPage={rowsPerPage}
        onSortChange={handleSortChange}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        hiddenColumnsSmallScreen={['topic', 'location']}

      />

      {/* Edit Modal */}
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        title={editingSchedule ? 'Edit Schedule' : 'Add Schedule'}
        onConfirm={editingSchedule ? handleUpdate : handleSubmit}
        confirmMessage={editingSchedule ? 'Update' : 'Add'}
      >
        <TextField
          fullWidth
          name="date"
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          sx={{ mb: '15px' }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          name="time"
          label="Time"
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          sx={{ mb: '15px' }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          name="location"
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          sx={{ mb: '15px' }}
        />
        <TextField
          fullWidth
          name="topic"
          label="Topic"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          sx={{ mb: '15px' }}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Delete Schedule"
        onConfirm={handleConfirmDelete}
        confirmMessage="Delete"
      >
        Are you sure you want to delete this schedule?
      </Modal>

      <ConfirmationModal
        open={deleteConfirm || updateConfirm}
        onClose={handleConfirmModalClose}
        title= {deleteConfirm ? "Delete Confirmation" : 'Update confirmation'}
        isLoading= {deleteConfirm ? deleteLoading : putLoading}
        message= {deleteConfirm ?
          "Time Table successfully deleted" :
          updateConfirm ? 'Time Table successfully updated' :
          deleteConfirm && deleteError ? "Could not update time tab;e, something went wrong" :
          updateConfirm && putError ? "Could not update time table, something went wrong" :
           "something went wrong"
          }

      >
        
      </ConfirmationModal>
    </Box>
  );
};

export default Instructor;
