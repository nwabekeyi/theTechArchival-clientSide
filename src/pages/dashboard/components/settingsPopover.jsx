import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Box, Typography, Popover, IconButton, Avatar, Button, 
  useTheme, Divider, TextField, Card, CardContent 
} from '@mui/material';
import { ColorModeContext, tokens } from '../theme';
import useAuth from '../../../hooks/useAuth';
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Modal from './modal';
import { useNavigate } from 'react-router-dom';


const SettingsPopover = ({ anchorEl, handleClose, userDetails }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { firstName, lastName, email, profilePictureUrl, role } = userDetails;
  const colorMode = useContext(ColorModeContext);

  const handleLogout = async () => {
    logout();
    navigate("/");
    
  };

  const handleChangePassword = () => {
    setPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileClick = () => {
    setProfileOpen(true);
  };

  const handleProfileClose = () => {
    setProfileOpen(false);
  };

  const handleDownloadIdCard = () => {
    // Logic to download the ID card as an image or PDF
    console.log("Download ID Card");
  };

  return (
    <>
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
        <Box display="flex" alignItems="center" mb={2} onClick={handleProfileClick} sx={{ cursor: 'pointer' }}>
          <Avatar src={profilePictureUrl} sx={{ width: 56, height: 56, mr: 2 }} />
          <Box>
            <Typography variant="h6">{`${firstName} ${lastName}`}</Typography>
            <Typography variant="body2" color="textSecondary">{email}</Typography>
            <Typography variant="body2" color="textSecondary">{role}</Typography>
          </Box>
        </Box>

        <Divider />

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography>Change Password</Typography>
          <IconButton onClick={handleChangePassword}>
            <LockOutlinedIcon />
          </IconButton>
        </Box>

        <Divider />

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography>Switch Mode</Typography>
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </IconButton>
        </Box>

        <Divider />

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography>Sign Out</Typography>
          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>

        <Modal
          open={passwordModalOpen}
          onClose={handleClosePasswordModal}
          title="Change Password"
          noConfirm={false}
          confirmText="Submit"
          onConfirm={() => {
            console.log("Password Data Submitted:", passwordData);
            handleClosePasswordModal();
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

      {/* Profile Popover */}
      <Popover
        open={profileOpen}
        onClose={handleProfileClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        PaperProps={{
          style: {
            padding: '24px',
            maxWidth: '400px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <Avatar src={profilePictureUrl} sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
          <CardContent>
            <Typography variant="h5">{`${firstName} ${lastName}`}</Typography>
            <Typography variant="body1" color="textSecondary">{email}</Typography>
            <Typography variant="body1" color="textSecondary">{role}</Typography>
          </CardContent>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleDownloadIdCard}
            sx={{ mt: 2 }}
          >
            Download ID Card
          </Button>
        </Card>
      </Popover>
    </>
  );
};

export default SettingsPopover;
