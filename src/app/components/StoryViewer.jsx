"use client";
import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from "react";
import { Box, LinearProgress } from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";

const StoryViewer = ({ onClose }) => {
  const dispatch = useDispatch();
  const { currentStories } = useSelector((state) => state.content);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0); // Track time in fractions of a second
  const [viewedStories, setViewedStories] = useState(new Set()); // To track viewed stories
  const duration = 3; // Duration for each story in seconds
  const currentStory = currentStories[currentStoryIndex];

  // Function to make API call to add the user to the viewers array
  const addToViewers = async (storyId) => {
    try {
      await axios.post("/api/story/view", { storyId });
   
    } catch (error) {
      dispatch(showAlert({type: "error", message: "Error adding viewer to story"}))
    }
  };

  // Add the viewer when a new story is displayed
  useEffect(() => {
    if (currentStory && !viewedStories.has(currentStory._id)) {
      addToViewers(currentStory._id); // Call API to add the user to viewers
      setViewedStories((prev) => new Set(prev).add(currentStory._id)); // Mark the story as viewed
    }
  }, [currentStory, viewedStories]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 0.05); // Increase elapsed time in small increments
    }, 50); // Update every 50ms for smoother progress

    return () => clearInterval(interval); // Cleanup interval when the timer stops
  }, []);

  useEffect(() => {
    if (elapsedTime >= duration) {
      handleNextStory(); // Move to the next story when the timer ends
    }
  }, [elapsedTime]);

  const handleNextStory = () => {
    if (currentStoryIndex < currentStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setElapsedTime(0); // Reset the elapsed time for the next story
    } else {
      onClose(); // Close the viewer when all stories are viewed
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setElapsedTime(0); // Reset the elapsed time for the previous story
    }
  };

  const handleSwipe = (direction) => {
    if (direction === "left") {
      handleNextStory();
    } else if (direction === "right") {
      handlePrevStory();
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.538)",
        zIndex: 1000, // Make sure it's on top of other elements
      }}
    >
      {/* LinearProgress bar smooth */}
      <LinearProgress
        variant="determinate"
        value={(elapsedTime / duration) * 100} // Calculate the progress as a percentage
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "5px", // Adjust the height of the progress bar
        }}
      />
      
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: "50%",
            height: "100%",
            cursor: "pointer", // Invisible left section
            zIndex: 10,
            position: "absolute",
            left: 0,
          }}
          onClick={() => handleSwipe("right")}
        />
        <Box
          sx={{
            width: "50%",
            height: "100%",
            cursor: "pointer", // Invisible right section
            zIndex: 10,
            position: "absolute",
            right: 0,
          }}
          onClick={() => handleSwipe("left")}
        />
      </Box>

      <Box
        sx={{
          position: "relative",
          width: "80%",
          height: "80%",
          backgroundColor: "white",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <img
          src={currentStory.media}
          alt="Story"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
        />
      </Box>

      {/* Close the story viewer when clicking on the background */}
      <Box
        sx={{
          position: "fixed",
          top: 10,
          right: 10,
          background: "white",
          borderRadius: "50%",
          width: 40,
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 1001, // Make sure it's on top of other elements
        }}
        onClick={onClose}
      >
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>X</span>
      </Box>
    </Box>
  );
};

export default StoryViewer;
