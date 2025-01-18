import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addChatroomMessage, updateDeliveredTo } from '../reduxStore/slices/messageSlice'; 
import io from 'socket.io-client';
import { checkDBFullnessAndSave, updateDeliveredToDB } from '../reduxStore/slices/messageSlice'; 

const useWebSocket = (listeners = [], actionToSend = null) => {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { userId, role, profilePictureUrl, lastName, firstName } = useSelector((state) => state.users.user) || {};
  const dispatch = useDispatch();
  const chatroomNames = useSelector((state) => state.message.chatrooms);
  const recipientDetails = {
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    profilePictureUrl: profilePictureUrl
  };

  useEffect(() => {
    if (!socket.current) {
      socket.current = io('http://localhost:4000', {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      

      // Handle 'chatroom message' event
      socket.current.on('chatroom message', ({ chatroomName, message }) => {
        console.log('Message received:', message);
        dispatch(checkDBFullnessAndSave({
          storeName: 'ChatroomMessages',
          chatroomName: chatroomName,
          message: message,
        }));
        dispatch(addChatroomMessage({ chatroomName, message }));

        // Emit deliveredTo event to notify the other client
        socket.current.emit('chatroomMessage deliveredTo', { chatroomName, recipientDetails, messageId: message._id, senderId: message.sender.id });
      });

      // Handle 'delivered to' event
      socket.current.on('chatroomMessage delivered', async ({ chatroomName, messageId, recipientDetails }) => {
        console.log('Message delivered to:', recipientDetails);
        const resolvedRecipientDetails = await recipientDetails;

        dispatch(updateDeliveredTo({
          chatroomName,
          messageId,
          recipientDetails: resolvedRecipientDetails,
        }));

        dispatch(updateDeliveredToDB({
          chatroomName,
          messageId,
          recipientDetails: resolvedRecipientDetails,
        }));
      });

      socket.current.on('connect', () => {
        setIsConnected(true);
        console.log('Socket Connected:', socket.current.id);
        if (userId && role) {
          socket.current.emit('userConnect', { userId, userRole: role });
        }
        if (actionToSend) {
          socket.current.emit('sendMessage', actionToSend);
        }
      });

      socket.current.on('disconnect', (reason) => {
        console.log('Socket disconnected due to', reason);
        setIsConnected(false);
      });

      return () => {
        if (socket.current) {
          socket.current.disconnect();
          console.log('Socket disconnected and cleaned up');
        }
      };
    }
  }, [userId, role, actionToSend, dispatch]);

  // Separate useEffect to emit 'get undelivered chatroomMessages' when chatroomNames are populated
  useEffect(() => {
    if (isConnected && chatroomNames.length > 0 && recipientDetails.userId) {
      console.log('Fetching undelivered messages for chatrooms:', chatroomNames);
      socket.current.emit('get undelivered chatroomMessages', { chatroomNames, recipientDetails });
    }
  }, [isConnected, chatroomNames, recipientDetails]);

  const emit = (event, messageBody) => {
    if (socket.current && isConnected) {
      socket.current.emit(event, messageBody);
    } else {
      console.error('WebSocket is not connected or ready.');
    }
  };

  const listen = useCallback((event, handler) => {
    if (socket.current) {
      socket.current.on(event, (messageData) => {
        console.log('Message received in listen:', messageData);
        handler(messageData); 
      });
      return () => {
        if (socket.current) {
          socket.current.off(event, handler);
        }
      };
    } else {
      console.error('Socket is not initialized.');
      return () => {};
    }
  }, []);

  return { emit, isConnected, listen }; 
};

export default useWebSocket;
