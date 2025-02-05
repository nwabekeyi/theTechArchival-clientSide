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

      {/* Main Content */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', // Gradient background
          p: 3,
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
            backdropFilter: 'blur(80px)',
            borderRadius: 2,
            boxShadow: 3, // Add shadow for depth
            textAlign: 'start',
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
              loading={loading}
              disabled={loading}
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
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ConfirmPassword;