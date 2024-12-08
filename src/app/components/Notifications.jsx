import { useDispatch } from 'react-redux';
import React from "react";
import NotificationItem from "./NotificationItem";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { clearNotifications } from '@/redux/notificationSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notification.notifications);
  return (
    <Box className="pt-3 px-4">
      <Stack>
        <Typography
          sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}
          variant="h5"
          gutterBottom
        >
          Notifications
        </Typography>
      </Stack>
      <Box sx={{display:"flex",justifyContent:"flex-end"}}><Button color="primary" onClick={()=>dispatch(clearNotifications())}>Clear</Button></Box>
      <Stack>
       {notifications.length > 0 ? (
          notifications.map((data,index) => (
            <NotificationItem key={index} data={data} />
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            No notifications yet
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Notifications;
