import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Box, Alert } from '@mui/material';
import Footer from './homePage/components/Footer';
import Navbar from './homePage/components/Header';
import LoadingButton from "../components/loadingButton";
import useApi from '../hooks/useApi';
import { endpoints } from '../utils/constants';

const ConfirmPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  console.log(endpoints.RESET_PASSWORD)

  const { loading, data, error, callApi } = useApi();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload
    console.log('called');

    const body = {
      email,
      token,
      newPassword
    };

    await callApi(endpoints.RESET_PASSWORD, 'PATCH', body);
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />
      <Box sx={{height: '100vh', display: 'grid', placeContent: 'center'}}>
        <Container maxWidth="sm" sx={{ mt: 4, p: 4, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Reset Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <Typography variant="subtitle1">Email: {email}</Typography>
            </Box>
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
              sx={{ mb: 2 }}
            />
            <LoadingButton
              type="submit"
              loading={loading}
              disabled={loading || !newPassword || newPassword !== confirmPassword}
            >
              RESET PASSWORD
            </LoadingButton>
          </form>

          {error && <Alert severity="error">{error}</Alert>}
          {data && <Alert severity="success">{data.message}</Alert>}
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ConfirmPassword;
