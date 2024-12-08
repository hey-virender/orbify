import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "@/redux/messageSlice";
import { toggleShowChat } from "@/redux/uiSlice";
const ChatWindow = ({ onSendMessage }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user.id);
  const { selectedChat } = useSelector((state) => state.message);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(selectedChat.conversationId, message);
      setMessage("");
    }
  };

  const onChatClose = () => {
    dispatch(setSelectedChat(null));
    dispatch(toggleShowChat(false));
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        padding: "16px",
        paddingBottom: 15,
      }}
    >
      <div className="flex items-center gap-3">
        <IoMdArrowRoundBack onClick={onChatClose} />
        <Avatar src={selectedChat.receiver.profilePicture} />
        <h2>{selectedChat.receiver.name}</h2>
      </div>
      <List
        sx={{
          maxHeight: "80%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selectedChat.messages && selectedChat.messages.length > 0 ? (
          selectedChat.messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                alignSelf: msg.sender === userId ? "flex-end" : "flex-start",
                backgroundColor:
                  msg.sender === userId ? "lightblue" : "lightgray",
                textAlign: msg.sender === userId ? "right" : "left",
                borderRadius: "8px",
                padding: "8px",
                marginBottom: "8px",
                maxWidth: "70%",
                width: 250,
              }}
            >
              <ListItemText primary={msg.text} />
            </ListItem>
          ))
        ) : (
          <p>Send a message to start conversation...</p>
        )}
      </List>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button sx={{ ml: 1 }} variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatWindow;
