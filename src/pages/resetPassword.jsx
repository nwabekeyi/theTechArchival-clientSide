import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';
import Footer from './homePage/components/Footer';
import Navbar from './homePage/components/Header';
import LoadingButton from "../components/loadingButton";
import useApi from '../hooks/useApi';
import { endpoints } from '../utils/constants';
import Modal from '../pages/dashboard/components/modal'
import BackgroundWithHOme from "../components/backgroundWithHome";


const SmapleComponent = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [successModal, setSuccessModal] = useState(false);


  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  console.log(endpoints.RESET_PASSWORD)

  const { loading, data, error: apiError, callApi } = useApi();
  const navigate = useNavigate();

  const handleSucessModalClose = () => {
    setSuccessModal(false);
    navigate('/');

  };

  const handleSucessModalConfrim = () => {
      navigate('/signin');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const body = {
      email,
      token,
      newPassword
    };

    const response = await callApi(endpoints.RESET_PASSWORD, 'PATCH', body);
    if(response && response.message === 'Password reset successful'){
      setSuccessModal(true);
      setSuccess(data.message);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <Box
          sx={{
            p: 3,
            textAlign: "start",
            backgroundColor: "white",
            boxShadow: 10,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
            Reset Password
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
            Enter your new password below.
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* <Box mb={2}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Email: <strong>{email}</strong>
              </Typography>
            </Box> */}

            <TextField
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              isLoading={loading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </LoadingButton>
          </form>

          {/* Error and Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 3 }}>
              {success}
            </Alert>
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Footer />

       {/* Confirmation Modal for Deleting Assignment */}
       <Modal
        open={successModal}
        onClose={handleSucessModalClose}
        title="Confirm Deletion"
        onConfirm={handleSucessModalConfrim }
      >
        <Box>
          <p>Password reset successful. Do you want to login?</p>
        </Box>
      </Modal>
    </div>
  );
};


const ForgotPassword = BackgroundWithHOme(SmapleComponent);


export default ForgotPassword;
