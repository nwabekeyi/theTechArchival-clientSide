import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, InputBase, IconButton, useTheme, Badge } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsPopover from '../../components/notificationPopper';
import CodeGenerator from '../../../../generateCode/codeGenerator'; 
import SettingsPopover from '../../components/settingsPopover';
import { tokens } from "../../theme"; // Assuming tokens is your color utility function

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { unreadCount } = useSelector((state) => state.notifications);
  const userDetails = useSelector((state) => state.users.user);

  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);

  const handleOpenNotifications = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
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

  return (
    <Box 
      display="flex" 
      justifyContent="space-between"
      py={2} 
      px={5} 
      // m= {-20}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: theme.palette.mode === "light" ? colors.blueAccent[200] : colors.primary[400],
        // width: "150%",
        // left:
      }}
    >
      {/* SEARCH BAR */}
      <Box display="flex" alignItems='center'>
        <Box
          display="flex"
          backgroundColor={theme.palette.mode === "dark" ? colors.grey[400] : colors.primary[700]}  // Grey background in dark mode
          borderRadius="3px"
        >
          <InputBase sx={{ pl: 2, flex: 1, color: 'white' }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1, color: 'white' }}>
            <SearchIcon />
          </IconButton>
        </Box>
        {(userDetails.role === "superadmin" || userDetails.role === "admin") && <CodeGenerator />}
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={handleOpenNotifications} sx={{ color: 'white' }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={handleOpenSettings} sx={{ color: 'white' }}>
          <SettingsOutlinedIcon />
        </IconButton>
      </Box>

      {/* Notifications Popover */}
      <NotificationsPopover
        anchorEl={notificationsAnchorEl}
        handleClose={handleCloseNotifications}
        userId={userDetails.userId}
        role={userDetails.role}
      />

      {/* Settings Popover */}
      <SettingsPopover
        anchorEl={settingsAnchorEl}
        handleClose={handleCloseSettings}
        userDetails={userDetails}
      />
    </Box>
  );
};

export default Topbar;
