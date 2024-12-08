"use client";
import { useDispatch } from "react-redux";
import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import {
  IoHomeOutline,
  IoChatboxEllipsesOutline,
  IoNotificationsOutline,
  IoMenu,
} from "react-icons/io5";
import { Badge } from "@mui/material";
import { useSelector } from "react-redux";
import { toggleActiveSection } from "@/redux/uiSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const { unreadMessages } = useSelector((state) => state.message);
  const { activeSection } = useSelector((state) => state.ui);
  const handleChange = (event, newValue) => {
    dispatch(toggleActiveSection(newValue));
  };

  return (
    <div>
      <BottomNavigation
        value={activeSection}
        sx={{
          position: "fixed",
          width: "100%",
          maxWidth: 500,
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "30px",
          border: "1px solid black",
          backgroundColor: "gray",
          "&.Mui-selected": {
            color: "white",
          },
        }}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<IoHomeOutline className="text-5xl" />}
          sx={{
            "&.Mui-selected": {
              color: "white",
            },
          }}
        />

        <BottomNavigationAction
          label="Chats"
          value="chats"
          icon={
            <>
              <Badge
                invisible={!unreadMessages}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": { top: 9, right: 1 },
                  "& svg": { fontSize: "1rem" }, // Consistent icon size
                }}
              ></Badge>
              <IoChatboxEllipsesOutline className="text-5xl" />
            </>
          }
          sx={{
            "&.Mui-selected": {
              color: "white",
            },
          }}
        />

        <BottomNavigationAction
          label="Notifications"
          value="notifications"
          icon={<IoNotificationsOutline className="text-5xl" />}
          sx={{
            "&.Mui-selected": {
              color: "white",
            },
          }}
        />
        <BottomNavigationAction
          label="Menu"
          value="menu"
          icon={<IoMenu className="text-5xl" />}
          sx={{
            "&.Mui-selected": {
              color: "white",
            },
          }}
        />
      </BottomNavigation>
    </div>
  );
}
