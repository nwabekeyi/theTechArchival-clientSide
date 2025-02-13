import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import Modal from '../../components/modal';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import ConfirmationModal from '../../components/confirmationModal';

const MakeAnnouncement = ({ openAnnoucementModal, setModalOpen }) => {
  const [formFields, setFormFields] = useState({
    title: '',
    message: '',
    dueDate: '' // Add the due date field
  });

  const { data, loading, callApi } = useApi();
  const [confirmModal, setConfirmModal] = useState(false);

  // Handle input changes for all fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { title, message, dueDate } = formFields;
    const body = { title, message, date: dueDate }; // Send form data including due date

    const response = await callApi(endpoints.ANNOUNCEMENT, "POST", body);
    if (response && response?.announcement) {
      setModalOpen(false);
      setConfirmModal(true);
      // Reset form fields
      setFormFields({ title: '', message: '', dueDate: '' });
    }
  };

  return (
    <>
      <Modal
        open={openAnnoucementModal}
        onClose={() => setModalOpen(false)}
        title="Make Announcement"
        onConfirm={handleSubmit}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={formFields.title}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            label="Message"
            name="message"
            value={formFields.message}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            required
          />
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formFields.dueDate}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{
              shrink: true, // Ensures the label doesn't overlap the date value
            }}
            required
          />
        </Box>
      </Modal>

      {/* Confirmation modal for success or error */}
      <ConfirmationModal
        open={confirmModal}
        isLoading={loading}
        onClose={() => setConfirmModal(false)}
        title="Confirm Announcement Submission"
        message={data ? 'Announcement submitted successfully!' : 'Could not submit announcement.'}
      />
    </>
  );
};

export { MakeAnnouncement };
