import React, { useState, useEffect, useCallback } from "react";
import { Box, IconButton, TextField, Paper, useTheme, List, ListItem, ListItemText, Avatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Picker from "emoji-picker-react";
import { tokens } from "../../../dashboard/theme"; // Assuming your token function for colors

const ChatForm = ({ message, currentChat, onSubmit }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [mentionPosition, setMentionPosition] = useState({});
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [messageState, setMessageState] = useState(message); // Using state for the message

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Handle mention selection
  const onChange = useCallback((e) => {
    const value = e.target.value;
    setMessageState(value); // Update the state with the new message

    if (value.includes('@')) {
      const query = value.split('@').pop().trim();
      setMentionQuery(query);
      setFilteredParticipants(
        currentChat.participants.filter((participant) =>
          `${participant.firstName} ${participant.lastName}`.toLowerCase().includes(query.toLowerCase())
        )
      );

      const inputElement = e.target;
      const cursorPos = inputElement.selectionStart;
      const rect = inputElement.getBoundingClientRect();
      const charWidth = 8; // Approximate width of each character
      const left = rect.left + charWidth * (cursorPos - value.lastIndexOf('@') - 1);
      const top = rect.top - 250;

      setMentionPosition({ left, top });
    } else {
      setMentionQuery('');
      setFilteredParticipants([]);
    }
  }, [currentChat.participants]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount (if there are any async tasks or timeouts)
      setShowEmojiPicker(false);
      setChosenEmoji(null);
    };
  }, []);

  const handleEmojiClick = (event, emojiObject) => {
    const emoji = event.emoji; // Extract the emoji from the object

    if (emoji) {
      setMessageState(prevState => prevState + emoji); // Append emoji to the message
    }
    setShowEmojiPicker(false); // Close the emoji picker after selecting an emoji
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(messageState); // Submit the message
    setMessageState('');
  };


  return (
    <Box>
      <form onSubmit={handleFormSubmit}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            p: 2,
            backgroundColor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            position: "relative",
          }}
        >
          {/* Emoji Picker Button */}
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              setShowEmojiPicker((prevState) => !prevState);
            }}
            sx={{ color: "primary.main" }}
          >
            <EmojiEmotionsIcon sx={{ fontSize: 28 }} />
          </IconButton>

          {/* Message Input */}
          <TextField
            variant="outlined"
            placeholder="Write a message"
            fullWidth
            value={messageState} // Controlled by state
            onChange={onChange} // Update state value on change
            multiline
            minRows={2}
            sx={{
              borderRadius: 2,
              "& .MuiInputBase-root": {},
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.grey[100],
              },
              height: "auto",
              minHeight: "80px",
            }}
          />

          {/* Send Button */}
          <IconButton
            type="submit"
            sx={{ color: colors.primary[100], transform: "rotate(0deg)" }}
          >
            <SendIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <Paper sx={{ position: "absolute", bottom: "50px", zIndex: 1000 }}>
            <Picker pickerStyle={{ width: "100%" }} onEmojiClick={handleEmojiClick} />
          </Paper>
        )}
      </form>

      {/* Show Chosen Emoji */}
      {chosenEmoji && (
        <Box sx={{ mt: 2 }}>
          <h4>Chosen Emoji:</h4>
          <img
            src={chosenEmoji.emoji}
            alt="Chosen emoji"
            style={{ width: "30px", height: "30px" }}
          />
        </Box>
      )}

      {/* Mention Suggestions */}
      {filteredParticipants.length > 0 && (
        <Box sx={{ position: 'absolute', top: mentionPosition.top, left: mentionPosition.left, backgroundColor: 'background.paper', boxShadow: 2, zIndex: 2, borderRadius: 1 }}>
          <List>
            {filteredParticipants.map((participant) => (
              <ListItem
                key={participant.userId}
                onClick={() => {
                  setMessageState(`${messageState.substring(0, messageState.lastIndexOf('@'))}@${participant.firstName} ${participant.lastName} `);
                  setMentionQuery('');
                  setFilteredParticipants([]);
                }}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: colors.grey[900],
                    transition: 'background-color 0.3s',
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
    </Box>
  );
};

export default React.memo(ChatForm);
