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
  
  const userDetails = useSelector((state) => state.users.user);
  const cohortName = userDetails.cohort;
  const postUrl = `${endpoints.TIMETABLE}/${cohortName}`;

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

  const columns = [
    { id: 'date', label: 'Date' },
    { id: 'time', label: 'Time' },
    { id: 'location', label: 'Location' },
    { id: 'topic', label: 'Topic' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(row)}
          >
            Delete
          </Button>
        </>
      ),
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
      }

      handleCloseDeleteModal();
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
    <Box m="20px">
      <Header title="TIME TABLE" subtitle="Overview of Weekly Schedule" />

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenEditModal}
        sx={{ mb: '15px' }}
      >
        Add Schedule
      </Button>

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
    </Box>
  );
};

export default Instructor;
