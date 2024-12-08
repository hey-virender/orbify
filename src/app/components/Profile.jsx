import { useDispatch } from "react-redux";
import { useEffect } from "react";
import React, { useState } from "react";
import { Avatar, Box, Typography, Divider, Button } from "@mui/material";
import Grid from "@mui/material/Grid2"; // Updated import for Grid
import Post from "./Post"; // Your existing Post component
import { IoIosClose } from "react-icons/io";
import { motion } from "framer-motion"; // Importing motion from framer-motion
import { useSelector } from "react-redux";
import { showAlert } from "@/redux/alertSlice";
import axios from "axios";
import { setSelectedChat } from "@/redux/messageSlice";
import {

  toggleActiveSection,
  toggleShowChat,
} from "@/redux/uiSlice";

const Profile = ({ user, onBack, searched }) => {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.user.user);
  const [activeTab, setActiveTab] = useState("Posts");
  const [isFollowing, setIsFollowing] = useState("IsFollowing");

  useEffect(() => {
    if (searched) {
      const following = user.followers.some((follower) => follower._id === id);
      setIsFollowing(following);
    }
  }, [user, id, searched]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFollowClick = async () => {
    try {
      setIsFollowing(!isFollowing);
      const response = await axios.put("/api/profile/follow", { id: user._id });
      if (response.status === 200) {
        dispatch(
          showAlert({
            type: "success",
            message: "Follow status changed Successfully",
          })
        );
      } else {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
   
      dispatch(
        showAlert({ type: "error", message: "Error occurred while following" })
      );
    }
  };

  const handleMessageClick = async () => {
    
    try {
      const response = await axios.post("/api/conversation", {
        receiverId: user._id,
      });
      if (response.status === 200) {
        dispatch(toggleActiveSection("chats"));
       
        dispatch(setSelectedChat(response.data.conversation));
        dispatch(toggleShowChat(true));
      }
    } catch (error) {
     
      dispatch(showAlert({ type: "error", message: "An error occurred " }));
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <Box sx={{ mt: 4, px: 2, position: "relative" }}>
      {/* User Info Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Avatar
          src={user.profilePicture}
          alt={user.name}
          sx={{ width: 80, height: 80, mr: 3 }}
        />
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {user.name}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={4}>
              <Typography variant="body2">
                <strong>{user.posts.length}</strong> Posts
              </Typography>
            </Grid>
            <Grid xs={4}>
              <Typography variant="body2">
                <strong>{user.followers.length}</strong> Followers
              </Typography>
            </Grid>
            <Grid xs={4}>
              <Typography variant="body2">
                <strong>{user.following.length}</strong> Following
              </Typography>
            </Grid>
          </Grid>
          {searched && (
            <Box>
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                onClick={handleFollowClick}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
              <Button onClick={handleMessageClick}>Message</Button>
            </Box>
          )}
        </Box>
        <IoIosClose
          className="text-5xl absolute top-1 right-1"
          onClick={onBack}
        />
      </Box>

      <Divider />

      {/* Toggle Section */}
      <Box sx={{ display: "flex", justifyContent: "space-evenly", my: 3 }}>
        {["Posts", "Followers", "Following"].map((tab) => (
          <Typography
            key={tab}
            variant="body1"
            sx={{
              cursor: "pointer",
              mx: 2,
              fontWeight: activeTab === tab ? "bold" : "normal",
              color: activeTab === tab ? "primary.main" : "text.secondary",
              transition: "color 0.3s",
              "&:hover": {
                color: "primary.main",
              },
            }}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </Typography>
        ))}
      </Box>

      <Divider />

      {/* Content Section */}
      <Box sx={{ mt: 3, maxWidth: 1000, mx: "auto" }}>
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tabVariants}
          transition={{ duration: 0.5 }}
        >
          {activeTab === "Posts" && (
            <Box>
              {user.posts.map((post) => (
                <Post key={post._id} data={post} singleUser={user} />
              ))}
            </Box>
          )}

          {activeTab === "Followers" && (
            <Box>
              {user.followers.map((follower) => (
                <Box
                  key={follower._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={follower.profilePicture}
                    alt={follower.name}
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                  <Typography variant="body1">{follower.name}</Typography>
                </Box>
              ))}
            </Box>
          )}

          {activeTab === "Following" && (
            <Box>
              {user.following.map((followed) => (
                <Box
                  key={followed._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={followed.profilePicture}
                    alt={followed.name}
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                  <Typography variant="body1">{followed.name}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </motion.div>
      </Box>
    </Box>
  );
};

export default Profile;
