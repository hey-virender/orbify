import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { FaSearch, FaTimes, FaWindowClose } from "react-icons/fa"; // Importing react-icons
import { useDispatch } from "react-redux";
import { showAlert } from "@/redux/alertSlice";
import axios from "axios";
import Profile from "./Profile";
const SearchSection = ({ onClose }) => {
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef(null);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear the previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set a new timer
    debounceTimer.current = setTimeout(async () => {
      if (query) {
        try {
          const response = await axios.get(
            `/api/profile/search?query=${query}`
          );
          if (response.status === 200) {
            setSearchResults(response.data.users);
          }
        } catch (error) {
          dispatch(
            showAlert({
              type: "error",
              message: "Error fetching search results",
            })
          );
        }
      } else {
        setSearchResults([]); // Clear results if the query is empty
      }
    }, 300); // Adjust debounce delay (e.g., 300ms)
  };
  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
  };
  const handleProfileClick = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/profile/${userId}`);
      if (response.status === 200) {
        setSelectedUser(response.data.user);
        setShowProfile(true);
      }
    } catch (error) {
      dispatch(
        showAlert({
          type: "error",
          message: "Error fetching user profile",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleProfileClose = () => {
    setShowProfile(false);
    setSelectedUser(null);
  };
  return showProfile ? (
    <Profile user={selectedUser} onBack={handleProfileClose} searched={true} />
  ) : (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "background.paper",
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        {/* Search Bar */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TextField
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for users..."
            fullWidth
            InputProps={{
              startAdornment: (
                <IconButton edge="start" disabled>
                  <FaSearch />
                </IconButton>
              ),
              endAdornment: searchQuery && (
                <IconButton onClick={handleClear}>
                  <FaTimes />
                </IconButton>
              ),
            }}
          />
          <IconButton onClick={onClose} sx={{ ml: 1 }}>
            <FaWindowClose />
          </IconButton>
        </Box>

        {/* Search Results */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          {searchResults.length > 0 ? (
            <List>
              {searchResults.map((user) => (
                <React.Fragment key={user._id}>
                  <ListItem onClick={() => handleProfileClick(user._id)}>
                    <ListItemAvatar>
                      <Avatar src={user.profilePicture} alt={user.name} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", mt: 5 }}
            >
              {searchQuery
                ? "No results found."
                : "Start typing to search for users."}
            </Typography>
          )}
        </Box>

        {/* Optional: Footer Buttons */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SearchSection;
