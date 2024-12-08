import { Avatar, Typography } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import React from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { useSelector } from "react-redux";

const Header = ({ onSearch,single }) => {
  const { name, profilePicture } = useSelector((state) => state.user.user);
  return (
    <header className="flex items-center justify-between p-3">
      <div className="flex items-center gap-2">
        {" "}
        <Avatar sx={{ bgcolor: deepOrange[500] }} src={profilePicture}></Avatar>
        <Typography sx={{}} variant="body">
          {name}
        </Typography>
      </div>

      <Typography sx={{ fontWeight: "bold" }} variant="h5">
        Orbify
      </Typography>
      {!single && <HiMiniMagnifyingGlass className="cursor-pointer text-3xl" onClick={onSearch} />}
    </header>
  );
};

export default Header;
