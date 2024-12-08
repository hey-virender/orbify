import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    conversations: [],
    messages: [],
    selectedChat: null,
    unreadMessages: true,
  },
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    addNewMessage: (state, action) => {
      state.selectedChat.messages.push(action.payload);
    },
    updateMessages: (state, action) => {
      state.selectedChat.messages = action.payload;
    },
    toggleUnreadMessages: (state, action) => {
      state.unreadMessages = action.payload;
    },

    markConversationAsRead: (state, action) => {
      const conversationId = action.payload;
      const conversation = state.conversations.find(
        (conversation) => conversation.conversationId === conversationId
      );
      if (conversation) {
        conversation.unread = false;
      }
    },
    decrementUnreadCount: (state) => {
      state.unreadCount -= 1;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    updateConversation: (state, action) => {
      const { conversationId, lastMessage, unread } = action.payload;

      // Find the conversation by its ID
      const conversationIndex = state.conversations.findIndex(
        (conversation) => conversation.conversationId === conversationId
      );

      if (conversationIndex !== -1) {
        // Update lastMessage
        state.conversations[conversationIndex].lastMessage = lastMessage;

        // Set unread status from the payload
        state.conversations[conversationIndex].unread = unread;

        // Update the updatedAt timestamp
        state.conversations[conversationIndex].updatedAt =
          new Date().toISOString();
      }
    },
    clearConversations: (state) => {
      state.conversations = [];
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  setSelectedChat,
  addNewMessage,
  updateMessages,
  toggleUnreadMessages,
  markConversationAsRead,
  clearMessages,
  setConversations,
  updateConversation,
  clearConversations,
} = messageSlice.actions;

export default messageSlice.reducer;
