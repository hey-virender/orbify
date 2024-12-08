import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import timeAgo from "../helper/timeAgo";
const NotificationItem = ({ data }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap:1,
        padding: 2,
        borderBottom: "1px solid #ccc",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Avatar
        sx={{ width: 60, height: 60 }}
        src={data.post.media[0]}
      />
     <Box sx={{display:"flex",gap:1}}>
     <Box sx={{ marginLeft: 1 }}>
        <Typography variant="subtitle2">{data.notification.message}</Typography>
        
      </Box>
      <Typography variant="caption" color="gray">{timeAgo(data.notification.createdAt)}</Typography>
     </Box>
    </Box>
  );
};

export default NotificationItem;
