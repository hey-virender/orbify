import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  IoSettingsOutline,
  IoLogOutOutline,
  IoPersonOutline,
} from "react-icons/io5";

const MenuList = ({ onMenuSelect }) => {
  return (
    <List>
      <ListItem button onClick={() => onMenuSelect("profile")}>
        <ListItemIcon>
          <IoPersonOutline />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItem>
      <Divider />
      <Divider />
      <ListItem button onClick={() => onMenuSelect("logout")}>
        <ListItemIcon>
          <IoLogOutOutline />
        </ListItemIcon>
        <ListItemText primary="Log Out" />
      </ListItem>
    </List>
  );
};

export default MenuList;
