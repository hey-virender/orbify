import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import axios from "axios";
import { setUser } from "@/redux/userSlice";
import { showAlert } from "@/redux/alertSlice";
import { motion } from "motion/react";
import { MdOutlineCancel } from "react-icons/md";

const EditProfile = ({ user, onCancel }) => {
  const dispatch = useDispatch();
  const [view, setView] = useState("profile"); // "profile" or "password"
  const [name, setName] = useState(user?.name || "");
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || ""
  );
  const [selectedFile, setSelectedFile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleToggleChange = (event, newView) => {
    if (newView) setView(newView);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      const response = await axios.put("/api/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const data = response.data.data;
        const newUser = {
          id: data._id,
          name: data.name,
          profilePicture: data.profilePicture,
          email: data.email,
          followers: data.followers,
          following: data.following,
          posts: data.posts,
        };
        dispatch(setUser(newUser));
        dispatch(
          showAlert({
            type: "success",
            message: "Profile updated successfully",
          })
        );
      }
    } catch (error) {
     
      dispatch(
        showAlert({ type: "error", message: "Failed to update profile" })
      );
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) {
      dispatch(
        showAlert({
          type: "error",
          message: "Please provide both current and new passwords",
        })
      );
      return;
    }
    if (confirmPassword !== newPassword) {
      dispatch(showAlert({ type: "error", message: "Passwords do not match" }));
      return;
    }
    try {
      const response = await axios.put("/api/profile/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (response.status === 200) {
        dispatch(
          showAlert({
            type: "success",
            message: "Password updated successfully",
          })
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        dispatch(
          showAlert({ type: "error", message: error.response.data.error })
        );
      }
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
      <Box sx={{display:"flex",alignItems:"center",justifyContent:"space-between",mb: 3}}>
        <Typography variant="h4" >
          Edit Profile
        </Typography>
        <MdOutlineCancel className="text-3xl" onClick={onCancel} />
      </Box>

      {/* Toggle for switching views */}
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleToggleChange}
        sx={{ mb: 4 }}
        aria-label="Edit options"
      >
        <ToggleButton value="profile" aria-label="Profile Update">
          Update Profile
        </ToggleButton>
        <ToggleButton value="password" aria-label="Change Password">
          Change Password
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Animated container */}
      <motion.div
        key={view}
        initial={{ x: view === "profile" ? -300 : 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: view === "profile" ? 300 : -300, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {view === "profile" && (
          <Box>
            {/* Profile Picture */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                src={profilePicture}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Button variant="contained" component="label" sx={{ ml: 2 }}>
                Upload Picture
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Box>

            {/* Name */}
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleProfileUpdate}
              sx={{ mb: 3 }}
            >
              Update Profile
            </Button>
          </Box>
        )}

        {view === "password" && (
          <Box>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePasswordUpdate}
            >
              Change Password
            </Button>
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default EditProfile;
