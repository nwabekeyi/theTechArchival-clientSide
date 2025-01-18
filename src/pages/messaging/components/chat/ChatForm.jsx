import React, { useState, useEffect } from "react";
import { Box, IconButton, TextField, Paper, useTheme } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Picker from "emoji-picker-react";
import { tokens } from "../../../dashboard/theme"; // Assuming your token function for colors

export default function ChatForm(props) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
      props.onChange({ target: { value: props.message + emoji } }); // Append emoji to message
    }
    setShowEmojiPicker(false); // Close the emoji picker after selecting an emoji
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newMessage = props.message; // Use message passed from parent
    props.onSubmit(newMessage); // Submit the message
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
              value={props.message} // Controlled by parent
              onChange={props.onChange} // Passed from parent
              multiline // Allow multiple lines of text
              minRows={2} // Start with 3 rows (increased height)
              sx={{
                borderRadius: 2,
                "& .MuiInputBase-root": {
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
                height: "auto", // Let the height adjust based on content
                minHeight: "80px", // Optional: Minimum height for the input field
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
