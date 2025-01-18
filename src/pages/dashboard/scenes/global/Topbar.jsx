import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import Redux hooks
import { Box, InputBase, IconButton, useTheme, Badge, Button, Avatar, Typography } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsPopover from '../../components/notificationPopper';
import CodeGenerator from '../../../../generateCode/codeGenerator'; 
import Modal from '../../components/modal';




const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  
  // Access notifications and unreadCount from Redux store
  const { unreadCount } = useSelector((state) => state.notifications);
  
  const userDetails = useSelector((state) => state.users.user);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  const handleOpenSettings = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);

  const handleOpenProfile = () => setProfileOpen(true);
  const handleCloseProfile = () => setProfileOpen(false);

  const handleOpenNotifications = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    // Do not mark all notifications as read here
    // Simply open the notification popover
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchorEl(null);
  };

  const isNotificationsOpen = Boolean(notificationsAnchorEl);
  const notificationsId = isNotificationsOpen ? 'simple-popover' : undefined;

  return (
    <Box display="flex" justifyContent="space-between"
     p={2} 
     borderRadius="7px"

     sx={{
      position: 'sticky',
      top: 0, // Stick to the top of the page
      zIndex: 1000, // Ensure it stays above other content
      backgroundColor: `${theme.palette.mode === "light" ? colors.blueAccent[800] : colors.primary[500]} !important`,
    }}
    >
      {/* SEARCH BAR */}
      <Box display="flex" justifyContent="space-between"  alignItems='center'>
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
        >
          <InputBase sx={{ pl: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        {/* pin generation button */}
        {(userDetails.role === "superadmin" || userDetails.role === "admin") && <CodeGenerator />}
      </Box>

      {/* ICONS */}
      <Box
        display="flex"
        sx={{
          color:
            theme.palette.mode === "light"
              ? colors.grey[900]
              : colors.blueAccent[700],
        }}
      >
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleOpenNotifications}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={handleOpenSettings}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleOpenProfile}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      {/* Notifications Popover */}
      <NotificationsPopover
        anchorEl={notificationsAnchorEl}
        handleClose={handleCloseNotifications}
        userId={userDetails.userId}  // Pass the userId from Redux state
        role={userDetails.role}      // Pass the user role from Redux state
      />

      {/* Profile Modal */}
      <Modal open={profileOpen} onClose={handleCloseProfile} title="Profile" noConfirm>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          {/* Profile Picture */}
          <Avatar alt="Profile Picture" src={userDetails.idCardUrl} sx={{ width: 100, height: 100, mb: 2 }} />
          
          {/* Display User Details */}
          <Typography variant="h6" sx={{ marginBottom: '10px' }}>
            <strong>First Name:</strong> {userDetails.firstName}
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: '10px' }}>
            <strong>Last Name:</strong> {userDetails.lastName}
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: '10px' }}>
            <strong>Email:</strong> {userDetails.email}
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: '10px' }}>
            <strong>Phone Number:</strong> {userDetails.phoneNumber}
          </Typography>
          
          {/* Close Button */}
          <Button onClick={handleCloseProfile} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Topbar;
