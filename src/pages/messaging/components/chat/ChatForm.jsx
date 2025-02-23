import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  IconButton,
  TextField,
  Paper,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Avatar,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Picker from "emoji-picker-react";
import { tokens } from "../../../dashboard/theme"; // Assuming your token function for colors
import useWebSocket from "../../../../hooks/useWebSocket";
import {
  checkDBFullnessAndSave,
  addChatroomMessage,
  setReplyToMessage,
  setMessage,
  setMessages
} from '../../../../reduxStore/slices/messageSlice';
import { SEND_MESSAGE } from '../../../../utils/graphql/mutations';
import { useMutation} from '@apollo/client';
import { useSelector} from 'react-redux';



const ChatForm = ({ 
  currentChat,
  mention,
  setMention
}) => {
  const message = useSelector((state) => state.message.message);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [mentionPosition, setMentionPosition] = useState({});
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [messageState, setMessageState] = useState(message);
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);

// Use the single handler for the 'chatroom message' event
const { emit, isConnected} = useWebSocket();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const emojiPickerRef = useRef(null); // Reference for the emoji picker

  // Handle mention selection
  const onChange = useCallback(
    (e) => {
      const value = e.target.value;
      setMessageState(value);

      if (value.includes('@')) {
        const query = value.split('@').pop().trim();
        setMentionQuery(query);
        setFilteredParticipants(
          currentChat.participants.filter((participant) =>
            `${participant.firstName} ${participant.lastName}`
              .toLowerCase()
              .includes(query.toLowerCase())
          )
        );

        const inputElement = e.target;
        const cursorPos = inputElement.selectionStart;
        const rect = inputElement.getBoundingClientRect();
        const charWidth = 8;
        const left = rect.left + charWidth * (cursorPos - value.lastIndexOf('@') - 1);
        const top = rect.top - 250;

        setMentionPosition({ left, top });
      } else {
        setMentionQuery('');
        setFilteredParticipants([]);
      }
    },
    [currentChat && currentChat.participants]
  );

  useEffect(() => {
    return () => {
      setShowEmojiPicker(false);
      setChosenEmoji(null);
    };
  }, []);

  const handleEmojiClick = (event, emojiObject) => {
    const emoji = event.emoji;

    if (emoji) {
      setMessageState((prevState) => prevState + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleFormSubmit = async () => {
    e.preventDefault();
    if (!isConnected) {
      console.log('Cannot send message, WebSocket is not connected.');
      return;
    }

    const messageBody = {
      chatroomName: currentChat.name,
      sender: {
        id: currentUser.userId,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        profilePictureUrl: currentUser.profilePictureUrl,
        role: currentUser.role,
      },
      message: messageState,
      messageType: 'text',
      deliveredTo: [],
      readBy: [],
      status: 'sent',
      replyTo: replyToMessage ? { id: replyToMessage._id, message: replyToMessage.message } : null,
      mention: mention || null,
    };

    try {
      const { data } = await sendMessageMutation({
        variables: messageBody,
      });

      if (data) {
        dispatch(setMessages((prevMessages) => [...prevMessages, data.sendMessage]));
        dispatch(setReplyToMessage(null));
        setMention('');
        dispatch(setMessage(''));
        emit('chatroom message', {
          ...messageBody,
          _id: data.sendMessage._id
        });
        dispatch(addChatroomMessage({ chatroomName: currentChat.name, message: data.sendMessage }));
        dispatch(checkDBFullnessAndSave({
          storeName: 'ChatroomMessages',
          chatroomName: currentChat.name,
          message: data.sendMessage,
        }));
        setMessageState('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Close the emoji picker when clicking outside of it
  const handleClickOutside = useCallback((event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  }, []);

  useEffect(() => {
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker, handleClickOutside]);

  return (
    <Box>
      <form onSubmit={handleFormSubmit}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            py: 1,
            position: "relative",
            "& .css-kcpv2-MuiInputBase-root-MuiOutlinedInput-root": {
              padding: 0,
            },
      
          }}
        >
          {/* Message Input with Emoji Picker at the Start */}
          <TextField
            variant="outlined"
            placeholder="Write a message"
            fullWidth
            value={messageState}
            onChange={onChange}
            multiline
            minRows={2}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      setShowEmojiPicker((prevState) => !prevState);
                    }}
                    sx={{ color: colors.primary[100] }}
                  >
                    <EmojiEmotionsIcon sx={{ fontSize: 28 }} />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    sx={{ color: colors.primary[100], transform: "rotate(0deg)" }}
                  >
                    <SendIcon sx={{ fontSize: 28 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: colors.primary[400],
              borderRadius: "25px",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              height: "auto",
              overflowY: "auto", // Allow overflow for long messages
              "& .MuiInputBase-input": {
                marginTop: '20px',
                textJustify: 'auto',
                height: "100%", // Ensure it takes full height
                textAlign: "start", // Center text in the input area
              },
            }}
          />

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <Paper
              ref={emojiPickerRef} // Reference for closing when clicking outside
              sx={{ position: "absolute", bottom: "50px", zIndex: 1000 }}
            >
              <Picker pickerStyle={{ width: "100%" }} onEmojiClick={handleEmojiClick} />
            </Paper>
          )}
        </Box>

        {/* Mention Suggestions */}
        {filteredParticipants.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: mentionPosition.top,
              left: mentionPosition.left,
              backgroundColor: "background.paper",
              boxShadow: 2,
              zIndex: 2,
              borderRadius: 1,
            }}
          >
            <List>
              {filteredParticipants.map((participant) => (
                <ListItem
                  key={participant.userId}
                  onClick={() => {
                    setMessageState(
                      `${messageState.substring(0, messageState.lastIndexOf('@'))}@${participant.firstName} ${participant.lastName} `
                    );
                    setMentionQuery('');
                    setFilteredParticipants([]);
                  }}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: colors.grey[900],
                      transition: "background-color 0.3s",
                    },
                  }}
                >
                  <Avatar src={participant.profilePictureUrl} sx={{ marginRight: 2 }} />
                  <ListItemText primary={`${participant.firstName} ${participant.lastName}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </form>
    </Box>
  );
};

export default React.memo(ChatForm);
