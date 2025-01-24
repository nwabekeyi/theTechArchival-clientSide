import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, Popover, IconButton, Avatar, Button, useTheme, Divider, TextField } from '@mui/material';
import { ColorModeContext, tokens } from '../theme';
import useAuth from '../../../hooks/useAuth';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Import for change password icon
import Modal from './modal';

const SettingsPopover = ({ anchorEl, handleClose, userDetails }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false); // State for password modal
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const open = Boolean(anchorEl);
  const { logout } = useAuth();

  const { firstName, lastName, email, profilePictureUrl, role } = userDetails;
  const colorMode = useContext(ColorModeContext);

  // Handle sign out
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Open change password modal
  const handleChangePassword = () => {
    setPasswordModalOpen(true);
  };

  // Close change password modal
  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
  };

  // Handle password input changes
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        style: { width: '20vw', padding: '16px' },
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar src={profilePictureUrl} sx={{ width: 56, height: 56, mr: 2 }} />
        <Box>
          <Typography variant="h6">{`${firstName} ${lastName}`}</Typography>
          <Typography variant="body2" color="textSecondary">{email}</Typography>
          <Typography variant="body2" color="textSecondary">{role}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* Change Password Icon */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography>Change Password</Typography>
        <IconButton onClick={handleChangePassword}>
          <LockOutlinedIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Toggle Dark/Light Mode */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography>Switch Mode</Typography>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
      </Box>

      <Divider />

      {/* Sign Out */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography>Sign Out</Typography>
        <IconButton onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Box>

      {/* Change Password Modal */}
      <Modal
        open={passwordModalOpen}
        onClose={handleClosePasswordModal}
        title="Change Password"
        noConfirm={false}
        confirmText="Submit"
        onConfirm={() => {
          // Handle password change submission
          console.log("Password Data Submitted:", passwordData);
          handleClosePasswordModal(); // Close the modal after submission
        }}
      >
        <TextField
          label="Current Password"
          name="currentPassword"
          type="password"
          fullWidth
          value={passwordData.currentPassword}
          onChange={handlePasswordInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="New Password"
          name="newPassword"
          type="password"
          fullWidth
          value={passwordData.newPassword}
          onChange={handlePasswordInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
          value={passwordData.confirmPassword}
          onChange={handlePasswordInputChange}
        />
      </Modal>
    </Popover>
  );
};

export default SettingsPopover;
