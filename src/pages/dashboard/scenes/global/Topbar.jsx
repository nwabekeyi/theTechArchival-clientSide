import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import Redux hooks
import { Box, InputBase, IconButton, useTheme, Badge, Button, Avatar, Typography } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsPopover from '../../components/notificationPopper';
import CodeGenerator from '../../../../generateCode/codeGenerator'; 
import SettingsPopover from '../../components/settingsPopover';




const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Access notifications and unreadCount from Redux store
  const { unreadCount } = useSelector((state) => state.notifications);
  
  const userDetails = useSelector((state) => state.users.user);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);

  const handleOpenNotifications = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    // Do not mark all notifications as read here
    // Simply open the notification popover
  };
  const handleOpenSettings = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchorEl(null);
  };
  const handleCloseSettings = () => {
    setSettingsAnchorEl(null);
  };

  const isNotificationsOpen = Boolean(notificationsAnchorEl);
  const isSettingsOpen = Boolean(settingsAnchorEl);

  const notificationsId = isNotificationsOpen ? 'simple-popover' : undefined;

  return (
    <Box display="flex" justifyContent="space-between"
     py={2} 
     px={5} 

     sx={{
      position: 'sticky',
      top: 0, // Stick to the top of the page
      zIndex: 1000, // Ensure it stays above other content
      backgroundColor: `${theme.palette.mode === "light" ? colors.blueAccent[200] : colors.primary[400]} !important`,
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
        <IconButton onClick={handleOpenNotifications}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={handleOpenSettings}>
          <SettingsOutlinedIcon />
        </IconButton>
      </Box>

      {/* Notifications Popover */}
      <NotificationsPopover
        anchorEl={notificationsAnchorEl}
        handleClose={handleCloseNotifications}
        userId={userDetails.userId}  // Pass the userId from Redux state
        role={userDetails.role}      // Pass the user role from Redux state
      />

        {/* Setttings Popover */}
        <SettingsPopover
        anchorEl={settingsAnchorEl}
        handleClose={handleCloseSettings}
        userDetails={userDetails}      // Pass the user role from Redux state
      />

    </Box>
  );
};

export default Topbar;
