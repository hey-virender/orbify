import React, { useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "@/redux/alertSlice";
import axios from "axios";
import { clearConversations, setConversations, updateMessages } from "@/redux/messageSlice";
import { setSelectedChat, } from "@/redux/messageSlice";
import { toggleShowChat } from "@/redux/uiSlice";
const Chats = () => {
  const dispatch = useDispatch();
  const {  showChat } = useSelector((state) => state.ui);
  const { selectedChat } = useSelector((state) => state.message);

  const fetchChats = async () => {
    try {
      const response = await axios.get("/api/conversation");
      
      dispatch(setConversations(response.data.conversations));
    } catch (error) {
      dispatch(
        showAlert({
          type: "error",
          message: "Error occurred while fetching chats",
        })
      );
  
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);
  

  const handleChatSelect = async (chatId) => {
    
    try {
      const response = await axios.get(`/api/conversation/${chatId}`);
      dispatch(setSelectedChat(response.data.conversation));
      dispatch(toggleShowChat(true));
    } catch (error) {
      dispatch(
        showAlert({
          type: "error",
          message: "Error occurred while fetching chat",
        })
      );
    }
  };

  const handleSendMessage = async (conversationId, newMessage) => {
   
    try {
      const response = await axios.post(
        "/api/conversation/send-message",
        { conversationId, message: newMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
     
      dispatch(updateMessages(response.data.messages))
    } catch (error) {
      dispatch(showAlert({type: "error", message: "Error sending message: "}))
    }
  };

  return (
    <div className="relative flex h-screen ">
      {showChat && selectedChat ? (
        <ChatWindow onSendMessage={handleSendMessage} />
      ) :  (
        <ChatList onChatSelect={handleChatSelect} />
      ) 
      }
    </div>
  );
};

export default Chats;
