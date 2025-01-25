import { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, IconButton, Menu, MenuItem, Avatar, List, ListItem, ListItemText, colors, useTheme } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useSubscription } from '@apollo/client';
import { SEND_MESSAGE } from '../../../../../utils/graphql/mutations';
import { MESSAGE_ADDED_SUBSCRIPTION } from '../../../../../utils/graphql/subscriptions';
import Message from '../Message';
import ChatForm from '../ChatForm';
import Loader from '../../../../../utils/loader';
import GroupInfo from './GroupInfo';
import { tokens } from "../../../../dashboard/theme"; // Your token function
import SearchMessages from './SearchComponent';
import GroupParticipants from './GroupParticipants';
import useWebSocket from '../../../../../hooks/useWebocket'; // Import socket instance
import { useSelector, useDispatch } from 'react-redux';
import { useChatroomVisibility } from '../../../../../hooks/useChatroomVisibilty';
import { useMessageVisibility } from '../../../../../hooks/useMessageVisibity';
import { loadMessagesFromIndexedDB } from '../../../../../reduxStore/slices/messageSlice';
import { checkDBFullnessAndSave, addChatroomMessage} from '../../../../../reduxStore/slices/messageSlice';

export default function ChatRoom({ currentChat, currentUser }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [messages, setMessages] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedView, setSelectedView] = useState('messages');
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  const scrollRef = useRef();
  const messageRefs = useRef({});
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [mention, setMention] = useState('');
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState({});
  const [message, setMessage] = useState('');
  const chatroomMessages = useSelector((state) => state.message.chatroomMessages[currentChat.name]);
  const loading = useSelector((state) => state.message.chatroomMessages.messageLoading);
  const chatroomName = useChatroomVisibility(scrollRef, currentChat);
  const visibleMessages = useMessageVisibility(messageRefs, messages, currentChat.name);
  const dispatch = useDispatch();
  const [db, setDb] = useState(null);

console.log(currentChat)
  useEffect(() => {
    let mounted = true; // Track if the component is mounted
  
    dispatch(loadMessagesFromIndexedDB({
      dbName: 'Messages',
      storeName: 'ChatroomMessages',
      chatroomName: currentChat.name
    }));
  
    return () => {
      mounted = false; // Cleanup by setting mounted to false when the component unmounts
    };
  }, [dispatch, currentChat.name]);


  const { data: subscriptionData } = useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    variables: { chatroomName: currentChat.name },
  });

  useEffect(() => {
    if (chatroomMessages) {
     setMessages(chatroomMessages);
    }
  }, [chatroomMessages]);



  useEffect(() => {
    if (subscriptionData && subscriptionData.messageAdded) {
      setMessages((prevMessages) => [
        ...prevMessages,
        subscriptionData.messageAdded,
      ]);
    }
  }, [subscriptionData]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (replyToMessage && messageRefs.current[replyToMessage._id]) {
      messageRefs.current[replyToMessage._id].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [replyToMessage]);

  // Use the single handler for the 'chatroom message' event
  const { emit, isConnected} = useWebSocket();



  const handleFormSubmit = async (message) => {
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
      message: message,
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
        setMessages((prevMessages) => [...prevMessages, data.sendMessage]);
        setReplyToMessage(null);
        setMention('');
        setMessage(''); // Clear input field after sending the message
        emit('chatroom message', {
          ...messageBody,
          _id: data.sendMessage._id
        });
        dispatch(addChatroomMessage({chatroomName: currentChat.name, message: data.sendMessage}));


        //dispatch to redux
        dispatch(checkDBFullnessAndSave({
          storeName: 'ChatroomMessages',  // Specify the object store name
          chatroomName: currentChat.name,     // Pass the chatroom name
          message: data.sendMessage,                       // Pass each message for saving and fullness check
        }));
       }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleReply = (message) => {
    setReplyToMessage(message);
    setMention('');
  };

  const handleCloseReply = () => {
    setReplyToMessage(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuSelect = (view) => {
    setSelectedView(view);
    handleMenuClose();
  };

  // Handle mention selection
  const handleMentionSelect = (participant) => {
    const mention = `${participant.firstName} ${participant.lastName}`;
    const cursorPosition = message.lastIndexOf(mentionQuery);
    const updatedMessage = message.slice(0, cursorPosition) + mention + message.slice(cursorPosition + mentionQuery.length);
    setMessage(updatedMessage);
    setMentionQuery('');
    setFilteredParticipants([]);
  };

  // Handle changes to the input message
  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);

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
  };

  const handleMessageClick = (message) => {
    if (message.replyTo && message.replyTo.id) {
      const replyMessage = messages.find((msg) => msg._id === message.replyTo.id);
      if (replyMessage && messageRefs.current[replyMessage._id]) {
        messageRefs.current[replyMessage._id].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  };

  console.log(currentChat)

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%'}}>
      <Paper sx={{ padding: 2, backgroundColor: colors.primary[800], borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {selectedView !== 'messages' && (
            <IconButton onClick={() => setSelectedView('messages')}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box>
            <Typography variant="h3" component="h2">
              {currentChat.name}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {
              currentChat.participants[0] !== null ? 
              currentChat.participants.map(participant => `${participant.firstName} ${participant.lastName}`).join(', ')
              :
              'no other particpant in this group yet'}
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleMenuSelect('groupInfo')}>Group Info</MenuItem>
          <MenuItem onClick={() => handleMenuSelect('search')}>Search</MenuItem>
          <MenuItem onClick={() => handleMenuSelect('participants')}>See Group Participants</MenuItem>
        </Menu>
      </Paper>

      {selectedView === 'messages' && (
        <>
          <Box sx={{ height: '100%', flex: 1, overflowY: 'auto', padding: 3, backgroundColor: colors.primary[900], borderBottom: 1, borderColor: 'divider', maxHeight: '100%' }}>
            {loading ? (
              <Loader />
            ) : (
              <Box component="ul" sx={{ listStyleType: 'none', padding: 0 }}>
                {messages.map((message, index) => (
                  <Box key={index} ref={(el) => { messageRefs.current[message._id] = el; }} onClick={() => handleMessageClick(message)}>
                    <Message
                     ref={(el) => (messageRefs.current[message._id] = el)} // Store the reference of each message
                      message={message}
                      self={currentUser.userId}
                      onReply={handleReply}
                      onCloseReply={handleCloseReply}
                      isReplyingTo={replyToMessage}
                      setIsReplyingTo={setReplyToMessage}
                      chatroomName = {currentChat.name}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {replyToMessage && (
            <Box sx={{ padding: 1, backgroundColor: colors.primary[700], borderLeft: 3, borderColor: 'primary.main', marginBottom: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 1 }}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Replying to:
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {replyToMessage.message}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseReply} sx={{ padding: '6px' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          )}

          <ChatForm
            message={message}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
          />
        </>
      )}

      {filteredParticipants.length > 0 && (
        <Box sx={{ position: 'absolute', top: mentionPosition.top, left: mentionPosition.left, backgroundColor: 'background.paper', boxShadow: 2, zIndex: 2, borderRadius: 1 }}>
          <List>
            {filteredParticipants.map((participant) => (
              <ListItem 
                key={participant.id} 
                onClick={() => handleMentionSelect(participant)} 
                sx={{
                  cursor: 'pointer', 
                  '&:hover': {
                    backgroundColor: colors.grey[900], 
                    transition: 'background-color 0.3s', 
                  }
                }}
              >
                <Avatar src={participant.profilePictureUrl} sx={{ marginRight: 2 }}/>
                <ListItemText primary={`${participant.firstName} ${participant.lastName}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {selectedView === 'groupInfo' && <GroupInfo currentChat={currentChat} />}
      {selectedView === 'search' && <SearchMessages currentChat={currentChat} />}
      {selectedView === 'participants' && <GroupParticipants participants={currentChat.participants} />}
    </Box>
  );
}
