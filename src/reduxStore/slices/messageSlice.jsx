import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveMessage, isDBFull, removeOldestMessage, getMessagesFromIndexedDB, updateDeliveredToIndexedDB } from '../../utils/indexedDBService';

// Thunk for loading messages from IndexedDB
export const loadMessagesFromIndexedDB = createAsyncThunk(
  'message/loadFromIndexedDB',
  async (payload) => {
    try {
      const messages = await getMessagesFromIndexedDB(payload.dbName, payload.storeName, payload.chatroomName);
      return { chatroomName: payload.chatroomName, messages }; // Return chatroom name and messages
    } catch (error) {
      console.error('Failed to load messages from IndexedDB:', error);
      return { error: error.message };
    }
  }
);
export const updateDeliveredToDB = createAsyncThunk(
  'message/updateDeliveredTo',
  async ({ chatroomName, messageId, recipientDetails }, { rejectWithValue }) => {
    try {
      console.log('called update thunk');
      // Ensure that you await the promise resolution from `updateDeliveredToIndexedDB`
      const updatedDeliveredTo = await updateDeliveredToIndexedDB(chatroomName, messageId, recipientDetails);
      
      // Return the resolved value, not the Promise
      return { chatroomName, messageId, updatedDeliveredTo };
    } catch (error) {
      console.error('Failed to update deliveredTo:', error);
      return rejectWithValue({ error: error.message });
    }
  }
);


// Thunk for saving messages to IndexedDB
const saveMessageToIndexedDB = createAsyncThunk(
  'message/saveToIndexedDB',
  async (payload, { rejectWithValue }) => {
    const { chatroomName, message } = payload;
    console.log(chatroomName);

    try {
      await saveMessage(chatroomName, message);
      return { success: true, chatroomName, message }; // Removed `storeName` as it wasn't passed
    } catch (error) {
      console.error('Failed to save message to IndexedDB:', error);
      return rejectWithValue({ error: error.message });
    }
  }
);


// Thunk for checking DB fullness and saving the message
export const checkDBFullnessAndSave = createAsyncThunk(
  'message/checkDBFullnessAndSave',
  async (payload, { dispatch }) => {
    const { storeName, chatroomName, message } = payload;

    try {
      const isFull = await isDBFull(storeName);
      if (isFull) {
        await removeOldestMessage(storeName);
      }

      // Pass the payload as a single object to saveMessageToIndexedDB
      return await dispatch(saveMessageToIndexedDB({ chatroomName, message }));
    } catch (error) {
      console.error('Error in checkDBFullnessAndSave:', error);
      throw error;
    }
  }
);


const initialState = {
  privateMessages: [],
  chatroomMessages: {}, // This will store chatroom messages
  messageLoading: false,
  error: null,
  chatrooms : [],
  unreadChatroomMessages : []
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addPrivateMessage: (state, action) => {
      state.privateMessages.push(action.payload);
    },

    addChatroomMessages: (state, action) => {
      const { chatroomName, messages } = action.payload;
      if (state.chatroomMessages[chatroomName]) {
        state.chatroomMessages[chatroomName] = [
          ...state.chatroomMessages[chatroomName],
          ...messages,
        ];
      } else {
        state.chatroomMessages[chatroomName] = messages;
      }

      console.log('Added chatroom messages for:', chatroomName, messages);
    },

    addChatroomMessage: (state, action) => {
      const { chatroomName, message } = action.payload;
      state.messageLoading = true;
      console.log(message)

      if (!state.chatroomMessages[chatroomName]) {
        state.chatroomMessages[chatroomName] = [];
      }
      state.chatroomMessages[chatroomName].push(message);
    },


     // New reducer to push recipientDetails into the deliveredTo array
     updateDeliveredTo: (state, action) => {
      const { chatroomName, messageId, recipientDetails } = action.payload;
      console.log(recipientDetails);

      const data = { chatroomName, messageId, recipientDetails } 

      // Find the message by messageId (_id) in the given chatroom
      const messages = state.chatroomMessages[chatroomName];
      if (messages) {
        const messageIndex = messages.findIndex(msg => msg._id === messageId);
        if (messageIndex !== -1) {
          // Push recipientDetails into the deliveredTo array for the found message
          state.chatroomMessages[chatroomName][messageIndex].deliveredTo.push(recipientDetails);
        }
      }
    },

    setMessageLoading: (state, action) => {
      state.messageLoading = action.payload;
    },
    // New reducers for managing chatrooms
    setAdminChatrooms: (state, action) => {
      state.chatrooms = action.payload; // Set chatrooms from an external source
    },

    // New reducer to set unread chatroom messages
    setUnreadChatroomMessages: (state, action) => {
       state.unreadChatroomMessages = action.payload;
        },

    addChatroom: (state, action) => {
      state.chatrooms.push(action.payload); // Add a new chatroom to the list
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveMessageToIndexedDB.pending, (state) => {
        state.messageLoading = true;
        state.error = null;
      })
      .addCase(saveMessageToIndexedDB.fulfilled, (state) => {
        state.messageLoading = false;
      })
      .addCase(saveMessageToIndexedDB.rejected, (state, action) => {
        state.messageLoading = false;
        state.error = action.payload.error;
      })
      .addCase(loadMessagesFromIndexedDB.pending, (state) => {
        state.messageLoading = true;
        state.error = null;
      })
      .addCase(loadMessagesFromIndexedDB.fulfilled, (state, action) => {
        state.messageLoading = false;
        const { chatroomName, messages } = action.payload;
        state.chatroomMessages[chatroomName] = messages;
      })
      .addCase(loadMessagesFromIndexedDB.rejected, (state, action) => {
        state.messageLoading = false;
        state.error = action.payload.error;
      });
  },
});

// Export the actions
export const { 
  addPrivateMessage,
  addChatroomMessages, 
  addChatroomMessage, 
  setMessageLoading, 
  updateDeliveredTo, 
  addChatroom, 
  setAdminChatrooms,
  setUnreadChatroomMessages
} = messageSlice.actions;

// Export the reducer
export default messageSlice.reducer;
