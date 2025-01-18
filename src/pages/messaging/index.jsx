
import { Box } from "@mui/material";
import ChatLayout from "./components/layouts/ChatLayout";

function ChatApp() {
  return (
    <Box sx={{  maxHeight: "100%", height:"100%", padding: "10px", }}>
        <ChatLayout />

    </Box>
  );
}

export default ChatApp;
