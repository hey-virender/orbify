import React from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";

const UserProfile = ({ me, user, onEditProfile, onLogout }) => {

  return (
    <Box sx={{ padding: 2, textAlign: "center", backgroundColor: "#f4f6f8" }}>
      <Avatar
        src={user?.profilePicture} // If available
        sx={{ width: 100, height: 100, margin: "0 auto", marginBottom: 2 }}
      />
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        {user.name}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "60%",
          marginX: "auto",
          marginY: 2,
        }}
      >
        <div>
          <Typography variant="body2" sx={{ fontWeight: "semibold" }}>
            Posts
          </Typography>
          <Typography variant="body1">{user.posts?.length}</Typography>
        </div>
        <div>
          <Typography variant="body2" sx={{ fontWeight: "semibold" }}>
            Followers
          </Typography>
          <Typography variant="body1">{user.followers?.length}</Typography>
        </div>
        <div>
          <Typography variant="body2" sx={{ fontWeight: "semibold" }}>
            Following
          </Typography>
          <Typography variant="body1">{user.following?.length}</Typography>
        </div>
      </Box>
      {me && (
        <>
          {" "}
          <Button
            variant="contained"
            onClick={onEditProfile}
            sx={{ marginBottom: 2, marginX: 1 }}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={onLogout}
            sx={{ marginBottom: 2, marginX: 1 }}
          >
            Log out
          </Button>
        </>
      )}
    </Box>
  );
};

export default UserProfile;
