import { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme, Menu, MenuItem, Avatar, Dialog, DialogTitle, DialogContent } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // Change the icon
import { tokens } from "../../../dashboard/theme";
import GroupParticipants from "../chat/ChatRoom/GroupParticipants";
import InfoIcon from '@mui/icons-material/Info';
import { useSelector } from 'react-redux';

export default function Message({
  message,
  self,
  onReply,
  isReplyingTo,
  setIsReplyingTo,
  mention,
  readByUsers,
  deliveredToUsers
}) {
  const [menuOpen, setMenuOpen] = useState(false); // State to control Menu visibility
  const [infoOpen, setInfoOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [longPress, setLongPress] = useState(false); // For detecting long press
  const menuRef = useRef(null); // Reference for the Box wrapping the Menu
  const menuItemsRef = useRef([]); // Reference for all MenuItems
  const touchStart = useRef(0); // Store touch start time
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const state = useSelector((state) => state);
console.log("Redux State:", state);
const chatroomMessages = useSelector((state) => state.message?.chatroomMessages);
console.log("Chatroom Messages:", chatroomMessages);
console.log('bbbvv')
const deliveredToArray = useSelector((state) => {
  const chatroomMessages = state.message?.chatroomMessages?.["code wizards"];
  return chatroomMessages?.map((message) => message?.deliveredTo) || [];
});

console.log("Delivered To Array:", deliveredToArray);

const readByArray = useSelector((state) => {
  const chatroomMessages = state.message?.chatroomMessages?.["code wizards"];
  return chatroomMessages?.map((message) => message?.readBy) || [];
});

console.log("Read By Array:", readByArray);





  // Handle right-click to show the reply menu
  const handleRightClick = (event) => {
    event.preventDefault(); // Prevent the default right-click menu
    setMenuOpen(true); // Show the menu
  };

  // Handle long press for mobile/tablet
  const handleTouchStart = (event) => {
    touchStart.current = Date.now();
  };

  const handleTouchEnd = (event) => {
    const touchDuration = Date.now() - touchStart.current;
    if (touchDuration >= 3000) { // 3 seconds for long press
      setMenuOpen(true); // Show the menu after 3 seconds
    }
  };

  // Handle the menu close if clicked outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuItemsRef.current.some((itemRef) => itemRef && itemRef.contains(event.target))
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  console.log('Delivered To Users:', deliveredToUsers);
  return (
   
    <Box
      sx={{
        width: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        padding: 1,
        position: 'relative', // Required for absolute positioning
      }}
      onContextMenu={handleRightClick} // Handle right-click for desktop
      onTouchStart={handleTouchStart} // Handle touch start for mobile/tablet
      onTouchEnd={handleTouchEnd} // Handle touch end for mobile/tablet
      data-message-id={message._id}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'end',
          padding: 1,
          backgroundColor: self === message.sender.id ? colors.primary[500] : colors.primary[600],
          borderRadius: 2,
          maxWidth: '80%',
          marginLeft: self === message.sender?.id ? 'auto' : '0',
          cursor: 'pointer',
          '&:hover': { backgroundColor: colors.grey[700] },
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          overflow: 'hidden',
          position: 'relative',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {message.replyTo && Object.keys(message.replyTo).length !== 0 ? (
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ fontStyle: 'italic', wordWrap: 'break-word', overflowWrap: 'break-word', width: '100%' }}
          >
            {message.replyTo.message}
          </Typography>
        ) : null}

        <Box
          sx={{
            display: 'flex',
            flexDirection: self !== message.sender.id ? 'column' : 'row',
            alignItems: 'start',
            justifyContent: 'center',
            width: '100%',
            flex: 1,
            paddingRight: self !== message.sender.id ? 'none' : '10px',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              width: '100%',
              color: '#fff',
            }}
          >
            {message.message}
          </Typography>

          {/* Arrow icon visible on hover and clickable to open reply menu */}
          {isHovered && (
            <KeyboardArrowDownIcon
              sx={{
                position: 'absolute',
                right: '5px',
                top: '50%',
                marginLeft: '5%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                paddingLeft: self !== message.sender.id ? 'none' : '10px',
              }}
              onClick={() => setMenuOpen(true)} // Open the reply menu on click
            />
          )}
        </Box>

        {/* Sender info below the message */}
        {self !== message.sender.id && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 1,
              marginRight: "2%"
            }}
          >
            <Avatar
              src={message.sender.profilePictureUrl}
              alt={message.sender.name}
              sx={{ width: 24, height: 24, marginRight: 1 }}
            />
            <Typography
              variant="caption"
              color="#fff"
              sx={{
                fontSize: '0.6rem',
                marginRight: 1,
              }}
            >
              {message.sender.name} ({message.sender.role})
            </Typography>
          </Box>
        )}

        <Box ref={menuRef}>
          {menuOpen && (
            <Menu
              anchorEl={menuRef.current}
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
            >
              <MenuItem
                ref={(el) => (menuItemsRef.current[0] = el)}
                onClick={(event) => {
                  event.stopPropagation();
                  onReply(message);
                  setMenuOpen(false);
                }}
              >
                <ReplyIcon sx={{ marginRight: 1 }} /> Reply
              </MenuItem>
              <MenuItem
                ref={(el) => (menuItemsRef.current[1] = el)}
                onClick={(event) => {
                  event.stopPropagation();
                  setInfoOpen(true); // Open the Info dialog
                  setMenuOpen(false);
                }}
              >
                <InfoIcon sx={{ marginRight: 1 }} /> Info
              </MenuItem>
            </Menu>
          )}
        </Box>
    
    {/* Info Dialog */}
    <Dialog
      open={infoOpen}
      onClose={() => setInfoOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        {/* Delivered To Section */}
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Delivered To
        </Typography>
        <GroupParticipants 
        title = ''
        participants={deliveredToArray.flat() || []} />

        {/* Read By Section */}
        <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
          Read By
        </Typography>
        <GroupParticipants 
        title = '' 
        participants={readByArray.flat() || []} />
      </DialogContent>
    </Dialog>

      
      </Box>
    </Box>
  );
}
