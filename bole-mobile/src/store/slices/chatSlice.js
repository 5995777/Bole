import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import { chatAPI } from '../../api/apiService';

// Socket URL
const SOCKET_URL = 'http://localhost:8080';

let socket;

// Connect to socket
export const connectSocket = createAsyncThunk(
  'chat/connectSocket',
  async (_, { getState, dispatch }) => {
    const { token } = getState().auth;
    
    if (!socket) {
      socket = io(SOCKET_URL, {
        auth: {
          token,
        },
      });

      // Listen for new messages
      socket.on('newMessage', (message) => {
        dispatch(receiveMessage(message));
      });

      // Listen for status changes
      socket.on('messageStatus', ({ messageId, status }) => {
        dispatch(updateMessageStatus({ messageId, status }));
      });
    }

    return true;
  }
);

// Disconnect socket
export const disconnectSocket = createAsyncThunk(
  'chat/disconnectSocket',
  async () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    return true;
  }
);

// Fetch chat conversations
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getConversations();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch messages for a conversation
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getMessages(conversationId);
      return { conversationId, messages: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Send a message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, content, type = 'TEXT' }, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().auth;
      
      const message = {
        conversationId,
        senderId: user.userId,
        content,
        type,
        status: 'SENT',
        timestamp: new Date().toISOString(),
      };
      
      // Emit message through socket
      if (socket) {
        socket.emit('sendMessage', message);
      }
      
      // Also send through REST API as fallback
      const response = await chatAPI.sendMessage(conversationId, content, type);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new conversation
export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (recipientId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.createConversation(recipientId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: {},
  loading: false,
  error: null,
  socketConnected: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    clearChatError: (state) => {
      state.error = null;
    },
    receiveMessage: (state, action) => {
      const message = action.payload;
      
      // Add message to the appropriate conversation
      if (state.messages[message.conversationId]) {
        state.messages[message.conversationId].push(message);
      } else {
        state.messages[message.conversationId] = [message];
      }
      
      // Update conversation last message
      const conversationIndex = state.conversations.findIndex(
        (conv) => conv.id === message.conversationId
      );
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = message;
        
        // Move conversation to top of list
        const conversation = state.conversations[conversationIndex];
        state.conversations.splice(conversationIndex, 1);
        state.conversations.unshift(conversation);
      }
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      
      // Find and update message status in all conversations
      Object.keys(state.messages).forEach((convId) => {
        const messageIndex = state.messages[convId].findIndex(
          (msg) => msg.id === messageId
        );
        
        if (messageIndex !== -1) {
          state.messages[convId][messageIndex].status = status;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Connect Socket
      .addCase(connectSocket.fulfilled, (state) => {
        state.socketConnected = true;
      })
      // Disconnect Socket
      .addCase(disconnectSocket.fulfilled, (state) => {
        state.socketConnected = false;
      })
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to fetch conversations';
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages[action.payload.conversationId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to fetch messages';
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        
        // Add message to the appropriate conversation
        if (state.messages[message.conversationId]) {
          // Update if message already exists (optimistic update)
          const messageIndex = state.messages[message.conversationId].findIndex(
            (msg) => msg.id === message.id || 
                    (msg.tempId && msg.tempId === message.tempId)
          );
          
          if (messageIndex !== -1) {
            state.messages[message.conversationId][messageIndex] = message;
          } else {
            state.messages[message.conversationId].push(message);
          }
        } else {
          state.messages[message.conversationId] = [message];
        }
        
        // Update conversation last message
        const conversationIndex = state.conversations.findIndex(
          (conv) => conv.id === message.conversationId
        );
        
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].lastMessage = message;
          
          // Move conversation to top of list
          const conversation = state.conversations[conversationIndex];
          state.conversations.splice(conversationIndex, 1);
          state.conversations.unshift(conversation);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload ? action.payload.message : 'Failed to send message';
      })
      // Create Conversation
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations.unshift(action.payload);
        state.currentConversation = action.payload;
        state.messages[action.payload.id] = [];
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to create conversation';
      });
  },
});

export const { 
  setCurrentConversation, 
  clearChatError, 
  receiveMessage, 
  updateMessageStatus 
} = chatSlice.actions;

export default chatSlice.reducer;