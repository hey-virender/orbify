"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Box } from "@mui/material";
import { useSelector } from "react-redux";

const StoryCircle = ({ story, onClick }) => {
  const { id } = useSelector(state=>state.user.user);
  let [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const checkNew = async () => {
      for (let i = 0; i < story.stories.length; i++) {
        if (!story.stories[i].viewers.includes(id)) {
          setIsNew(true);
          break;
        }
      }
    };
    checkNew();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Box
        sx={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: isNew
            ? "linear-gradient(45deg, #ff9a9e, #fad0c4, #fad0c4)"
            : "none",
          padding: 1,
          cursor: "pointer", // Make the circle clickable
        }}
        onClick={onClick} // Trigger the onClick handler passed from the parent
      >
        <Avatar
          src={
            story.user.profilePicture ||
            "https://img.freepik.com/free-psd/macaroon-isolated-transparent-background_191095-35017.jpg?ga=GA1.1.621589541.1729773915&semt=ais_hybrid"
          }
          alt={story.user.name || "User"} // Show the username or fallback text
          sx={{
            width: 56,
            height: 56,
            border: isNew ? "2px solid white" : "none", // Inner border for unread stories
          }}
        />
      </Box>
      <p className="text-xs mt-1">{story.user.name || "User"}</p>{" "}
      {/* Show username */}
    </div>
  );
};

export default StoryCircle;
