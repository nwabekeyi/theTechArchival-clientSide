import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';
import Footer from './homePage/components/Footer';
import Navbar from './homePage/components/Header';
import LoadingButton from "../components/loadingButton";


const ConfirmPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get the email and token from the URL query parameters
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    // Simulate a request for password reset
    setTimeout(() => {
      setLoading(false);
      setSuccess('Password reset successful!');
    }, 2000);
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />
      <Box sx={{height: '100vh', display: 'grid', placeContent: 'center'}}>

      <Container maxWidth="sm" sx={{ mt: 4, p: 4, bgcolor: '#f5f5f5', borderRadius: 2}}>
        <Typography variant="h4" align="center" gutterBottom>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={2}  >
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
            >
           RESET PASSWORD
         </LoadingButton>
        </form>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Container>

      </Box>

     

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ConfirmPassword;
