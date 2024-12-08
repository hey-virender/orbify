import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Button,
  Modal,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FaPenNib } from "react-icons/fa";
import { blue } from "@mui/material/colors";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setConversations } from "@/redux/messageSlice";
import { showAlert } from "@/redux/alertSlice";

const ChatList = ({ onChatSelect }) => {
  const { conversations } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false); // Modal state
  const [userList, setUserList] = useState([]); // Users to display in the modal
  const [loading, setLoading] = useState(false); // Loading indicator

  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get("/api/conversation");
        dispatch(setConversations(response.data.conversations));
      } catch (error) {

      }
    };
    fetchConversations();
  }, [dispatch]);

  // Fetch users for the modal
  const handleOpenNewChat = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/profile/followers-following");
      setUserList(response.data.users); // Assuming API returns { users: [...] }
    } catch (error) {
   
    } finally {
      setLoading(false);
    }
    setOpen(true);
  };

  // Handle user selection from the modal
  const handleUserSelect = async (receiverId) => {
    setLoading(true);
    try {
      // Check for existing conversation or create a new one
      const response = await axios.post("/api/conversation", { receiverId });
   
      const { conversationId } = response.data.conversation;
     

      // Close the modal and select the conversation
      setOpen(false);
      onChatSelect(conversationId);
    } catch (error) {
      dispatch(showAlert({type: "error", message: "Error creating conversation"}))
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      {/* Chat List */}
      <List>
        {conversations.length === 0 ? (
          <ListItem>
            <ListItemText primary="No conversations yet" />
          </ListItem>
        ) : (
          conversations?.map((chat, index) => (
            <ListItem
              button
              key={index}
              onClick={() => onChatSelect(chat.conversationId)}
            >
              <ListItemAvatar>
                <Avatar src={chat.receiver.profilePicture} />
              </ListItemAvatar>

              <ListItemText
                primary={
                  <span className={chat.unread ? "font-bold" : ""}>
                    {chat.receiver.name}
                  </span>
                }
                secondary={
                  <span className={chat.unread ? "font-bold" : ""}>
                    {chat.lastMessage}
                  </span>
                }
              />
            </ListItem>
          ))
        )}
      </List>

      {/* New Chat Button */}
      <Box
        sx={{
          position: "absolute",
          bottom: 100,
          right: 16,
          backgroundColor: blue[500],
          color: "white",
        }}
      >
        <Button
          size="small"
          variant="contained"
          endIcon={<FaPenNib />}
          onClick={handleOpenNewChat}
        >
          New Chat
        </Button>
      </Box>

      {/* Modal for New Chat */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Start a New Chat
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <List>
              {userList.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No users available" />
                </ListItem>
              ) : (
                userList.map((user) => (
                  <ListItem
                    button
                    key={user._id}
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <ListItemAvatar>
                      <Avatar src={user.profilePicture} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ChatList;
