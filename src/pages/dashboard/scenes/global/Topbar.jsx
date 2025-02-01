import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, InputBase, IconButton, useTheme, Badge, List, ListItem, ListItemText, Divider } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsPopover from '../../components/notificationPopper';
import CodeGenerator from '../../../../generateCode/codeGenerator'; 
import SettingsPopover from '../../components/settingsPopover';
import { tokens } from "../../theme"; // Assuming tokens is your color utility function
import { useLocation, useNavigate } from 'react-router-dom';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { unreadCount } = useSelector((state) => state.notifications);
  const userDetails = useSelector((state) => state.users.user);

  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const path = useLocation().pathname;
  const navigate = useNavigate();  // For navigation based on search

  // Sample search data (could be dynamic)
  const searchData = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'User Management', path: '/dashboard/userManagement' },
    { name: 'Settings', path: '/settings' },
    { name: 'Profile', path: '/profile' },
    { name: 'Notifications', path: '/notifications' },
    { name: 'Timetable', path: '/dashboard/timeTable' },
    // Add more pages or sections as required
  ];

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter search data based on query
    const filteredResults = searchData.filter(item =>
      item.name.toLowerCase().includes(query)
    );
    setSearchResults(filteredResults);  // Update search results
  };

  // Handle selection of search result
  const handleSearchResultClick = (path) => {
    navigate(path);  // Navigate to the selected path
    setSearchQuery("");  // Clear the search input
    setSearchResults([]);  // Clear the search results
  };

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
      px={4}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: theme.palette.mode === "light" ? colors.blueAccent[200] : "none",
        width: "100%",
      }}
    >
      {/* SEARCH BAR */}
      <Box display="flex" alignItems='center'>
        <Box
          display="flex"
          backgroundColor={theme.palette.mode === "dark" ? colors.grey[400] : colors.primary[700]}  // Grey background in dark mode
          borderRadius="3px"
        >
          <InputBase
            sx={{ pl: 2, flex: 1, color: 'white' }}
            placeholder="Search"
            value={searchQuery} // Bind search query value
            onChange={handleSearchChange} // Handle search query update
          />
          <IconButton type="button" sx={{ p: 1, color: 'white' }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Code Generator (Admin/Superadmin only) */}
        {
          (userDetails.role === "superadmin" || userDetails.role === "admin") 
          && path === '/dashboard/userManagement' 
          &&<CodeGenerator />
        }
      </Box>

      {/* SEARCH RESULTS */}
      {searchQuery && (
        <Box 
          sx={{
            position: "absolute",
            top: "100%",
            left: "0",
            backgroundColor: colors.grey[100],
            color: colors.primary[900],
            boxShadow: 3,
            width: "50%",
            zIndex: 1000,
            maxHeight: "300px",
            overflowY: "auto",
            borderRadius: "4px",
            marginTop: "8px",
          }}
        >
          <List>
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <ListItem button onClick={() => handleSearchResultClick(result.path)} key={result.path}>
                  <ListItemText primary={result.name} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No results found" />
              </ListItem>
            )}
          </List>
        </Box>
      )}

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
