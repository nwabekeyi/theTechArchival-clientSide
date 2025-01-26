import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme, Menu, MenuItem, Avatar, Dialog, DialogContent } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { tokens } from "../../../dashboard/theme";
import GroupParticipants from "../chat/ChatRoom/GroupParticipants";
import InfoIcon from '@mui/icons-material/Info';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

// Memoized selector for deliveredTo array
const getDeliveredToArray = createSelector(
  (state, currentChat) => state.message?.chatroomMessages?.[currentChat.name],
  (chatroomMessages) => chatroomMessages?.map((message) => message?.deliveredTo) || []
);

// Memoized selector for readBy array
const getReadByArray = createSelector(
  (state, currentChat) => state.message?.chatroomMessages?.[currentChat.name],
  (chatroomMessages) => chatroomMessages?.map((message) => message?.readBy) || []
);

const Message = React.forwardRef(({
  message,
  self,
  onReply,
  isReplyingTo,
  setIsReplyingTo,
  mention,
  currentChat
}, ref) => { // Accept ref here
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const menuItemsRef = useRef([]);
  const touchStart = useRef(0);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const deliveredToArray = useSelector((state) => getDeliveredToArray(state, currentChat));
  const readByArray = useSelector((state) => getReadByArray(state, currentChat));

  // Use refs to store the arrays without triggering rerenders
  const deliveredToRef = useRef(deliveredToArray);
  const readByRef = useRef(readByArray);

  useEffect(() => {
    deliveredToRef.current = deliveredToArray;
  }, [deliveredToArray]);

  useEffect(() => {
    readByRef.current = readByArray;
  }, [readByArray]);

  const handleRightClick = (event) => {
    event.preventDefault();
    setMenuOpen(true);
  };

  const handleTouchStart = (event) => {
    touchStart.current = Date.now();
  };

  const handleTouchEnd = (event) => {
    const touchDuration = Date.now() - touchStart.current;
    if (touchDuration >= 3000) {
      setMenuOpen(true);
    }
  };

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

  return (
    <Box
      ref={ref} // Use the ref here
      sx={{
        width: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        padding: 1,
        position: 'relative',
        flexWrap: 'wrap',
      }}
      onContextMenu={handleRightClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
          maxWidth: '50%',
          width: 'auto',
          marginLeft: self === message.sender?.id ? 'auto' : '0',
          cursor: 'pointer',
          '&:hover': { backgroundColor: colors.grey[700] },
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          overflow: 'hidden',
          position: 'relative',
          wordBreak: 'break-word',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {message.replyTo && Object.keys(message.replyTo).length !== 0 && (
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ fontStyle: 'italic', wordWrap: 'break-word', overflowWrap: 'break-word', width: '100%' }}
          >
            {message.replyTo.message}
          </Typography>
        )}

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
            variant="body1" // Corrected here
            sx={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              width: '100%',
              color: '#fff',
              marginRight: '20px'
            }}
          >
            {message.message}
          </Typography>

          {isHovered && (
            <KeyboardArrowDownIcon
              sx={{
                position: 'absolute',
                right: '5px',
                top: '50%',
                marginLeft: '8%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                paddingLeft: self !== message.sender.id ? 'none' : '10px',
                fontSize: self === message.sender.id ? '2rem' : '1.5rem',
              }}
              onClick={() => setMenuOpen(true)} 
            />
          )}
        </Box>

        {self !== message.sender.id && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'end',
              marginTop: 1,
              marginRight: '2%',
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
              <MenuItem onClick={() => onReply(message)}>
                <ReplyIcon sx={{ marginRight: 1 }} /> Reply
              </MenuItem>
              <MenuItem onClick={() => setInfoOpen(true)}>
                <InfoIcon sx={{ marginRight: 1 }} /> Info
              </MenuItem>
            </Menu>
          )}
        </Box>

        <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} fullWidth maxWidth="sm">
          <DialogContent>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Delivered To
            </Typography>
            <GroupParticipants title="" participants={deliveredToRef.current?.flat() || []} />

            <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
              Read By
            </Typography>
            <GroupParticipants title="" participants={readByRef.current?.flat() || []} />
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
});

export default Message;
