import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, TextField, Paper, useTheme } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Picker from "emoji-picker-react";
import { tokens } from "../../../dashboard/theme"; // Assuming your token function for colors

export default function ChatForm(props) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const inputRef = useRef(""); // Ref for the input value
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      setShowEmojiPicker(false);
      setChosenEmoji(null);
    };
  }, []);

  const handleEmojiClick = (event, emojiObject) => {
    const emoji = event.emoji; // Extract the emoji
    if (emoji) {
      inputRef.current += emoji; // Append emoji to the current input
      props.onChange({ target: { value: inputRef.current } }); // Inform parent of the new value
    }
    setShowEmojiPicker(false); // Close emoji picker
  };

  const handleInputChange = (e) => {
    inputRef.current = e.target.value; // Update the ref without causing re-renders
    props.onChange(e); // Pass the event to the parent for controlled state
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(inputRef.current); // Use the value from the ref
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
            defaultValue={props.message} // Use defaultValue instead of value for better performance
            onChange={handleInputChange}
            multiline
            minRows={2}
            sx={{
              borderRadius: 2,
              "& .MuiInputBase-root": {},
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
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
    </Box>
  );
}
