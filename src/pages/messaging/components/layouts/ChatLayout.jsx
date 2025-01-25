import React, { useEffect, useState, useRef } from "react";
import { Box, Grid, Paper, IconButton, useTheme } from "@mui/material";
import { tokens } from "../../../dashboard/theme"; // Your token function
import { useQuery } from "@apollo/client";
import { GET_CHATROOMS, GET_CHATROOM } from "../../../../utils/graphql/queries"; // Import the queries
import { useSelector, useDispatch} from "react-redux";
import ChatRoom from "../chat/ChatRoom";
import Welcome from "../chat/Welcome";
import AllUsers from "../chat/AllUsers";
import SearchUsers from "../chat/SearchUsers";
import GroupIcon from "@mui/icons-material/Group"; // Import an icon, replace with your desired one
import { addChatroom } from '../../../../reduxStore/slices/messageSlice';

export default function ChatLayout() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, SetUsers] = useState([]);
  const [singleRoom, setSingleRoom] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [onlineUsersId, setOnlineUsersId] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isContact, setIsContact] = useState(false);
  const socket = useRef();
  const user = useSelector((state) => state.users.user); // Get the current user
  const dispatch = useDispatch(); // Correctly call useDispatch as a function

  // Fetch the chatroom based on the user's role (only for students and instructors)
  const { loading: loadSingleRoom, data: singleRoomData } = useQuery(GET_CHATROOM, {
    variables: { name: user.cohort },
    skip: !(user.cohort && ['student', 'instructor'].includes(user.role)), // Run only if the user is a student or instructor and has a cohort
  });

  // Query to get all chatrooms for admins and superadmins
  const { loading: loadAllRooms, data: allRoomsData } = useQuery(GET_CHATROOMS, {
    skip: !['admin', 'superadmin'].includes(user.role), // Skip if the user is not admin or superadmin
  });

  useEffect(() => {
    if (singleRoomData) {
      setSingleRoom(singleRoomData.getChatroom); // Set single room data
      // Dispatch addChatroom with the room name
      dispatch(addChatroom(singleRoomData.getChatroom.name));      
    }
  }, [singleRoomData]);

  useEffect(() => {
    if (allRoomsData) {
      setChatRooms(allRoomsData.getChatrooms); // Set all chatrooms data
      allRoomsData.getChatrooms.forEach((chatRoom) => {
        dispatch(addChatroom(chatRoom.name));
      })
    }
  }, [allRoomsData]);

  // Filter users and chatrooms based on search query
  useEffect(() => {
    setFilteredUsers(users);
    setFilteredRooms(chatRooms);
  }, [users, chatRooms]);

  useEffect(() => {
    if (isContact) {
      setFilteredUsers([]);
    } else {
      setFilteredRooms([]);
    }
  }, [isContact]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat); // Update the current chatroom
  };

  const handleSearch = (newSearchQuery) => {
    setSearchQuery(newSearchQuery);

    const searchedUsers = users.filter((user) => {
      return user.displayName
        .toLowerCase()
        .includes(newSearchQuery.toLowerCase());
    });

    const searchedUsersId = searchedUsers.map((u) => u.uid);

    if (chatRooms.length !== 0) {
      chatRooms.forEach((chatRoom) => {
        const isUserContact = chatRoom.participants.some(
          (e) => e !== user.uid && searchedUsersId.includes(e)
        );
        setIsContact(isUserContact);

        isUserContact
          ? setFilteredRooms([chatRoom])
          : setFilteredUsers(searchedUsers);
      });
    } else {
      setFilteredUsers(searchedUsers);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: `${
          theme.palette.mode === "light"
            ? colors.primary[100]
            : colors.primary[400]
        }`,
      }}
    >
      <Grid container sx={{ height: "100%" }}>
        {/* Left Side - Users and Search */}
        <Grid
          item
          xs={12}
          lg={3} // Set left side to 25% (or lg={3} for 3/12 of the screen width)
          sx={{
            borderRight: `1px solid ${colors.grey[300]}`,
            display: "flex",
            flexDirection: "column",
            backgroundColor: `${
              theme.palette.mode === "light"
                ? colors.blueAccent[800]
                : colors.primary[100]
            }`,
            overflowY: "auto",
            height: "100%",
          }}
        >
          <Paper
            sx={{
              padding: 2,
              backgroundColor: colors.primary[800],
              borderRadius: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // This aligns the icon to the right
            }}
          >
            <SearchUsers handleSearch={handleSearch} />
            {/* Icon at the right side */}
            <IconButton>
              <GroupIcon sx={{ color: colors.grey[100] }} />
            </IconButton>
          </Paper>

          <Paper
            sx={{
              padding: 2,
              overflowY: "auto",
              backgroundColor: colors.primary[900],
              borderRadius: 0,
              flexGrow: 1,
            }}
          >
            <AllUsers
              users={searchQuery !== "" ? filteredUsers : users}
              chatRooms={
                searchQuery !== ""
                  ? filteredRooms
                  : ["admin", "superadmin"].includes(user.role)
                  ? chatRooms
                  : singleRoom
              }
              setChatRooms={
                ["superadmin", "admin"].includes(user.role)
                  ? setChatRooms
                  : setSingleRoom
              }
              changeChat={handleChatChange}
              role={user.role}
            />
          </Paper>
        </Grid>

        {/* Right Side - Chat Room or Welcome Screen */}
        <Grid
          item
          xs={12}
          lg={9} // Set right side to take the remaining space (or lg={9} for 9/12 of the screen width)
          sx={{
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            maxHeight: "100%",
          }}
        >
          <Paper
            sx={{
              backgroundColor: colors.primary[500],
              height: "100%",
              borderRadius: 0,
            }}
          >
            {currentChat ? (
              <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    padding: 2,
                    maxHeight: "100%",
                    height: "100%",
                  }}
                >
                  <ChatRoom
                    currentChat={currentChat}
                    currentUser={user}
                    socket={socket}
                  />
                </Box>
              </Box>
            ) : (
              <Welcome />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
