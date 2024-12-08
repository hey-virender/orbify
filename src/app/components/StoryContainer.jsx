"use client";
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from "react";
import StoryCircle from "./StoryCircle";
import StoryUploadCircle from "./StoryUploadCircle";
import { setCurrentStories, setStories } from "@/redux/contentSlice";
import axios from "axios";
import { useSelector } from "react-redux";
import { showAlert } from '@/redux/alertSlice';

const StoryContainer = ({ setIsCreateStoryVisible, setIsStoryViewerOpen }) => {
  const dispatch = useDispatch();
  const {stories} = useSelector(state=>state.content)
 


  // Fetch stories data
  const fetchStories = async () => {
    try {
      const response = await axios.get("/api/story");
     
      dispatch(setStories(response.data.stories));
    } catch (error) {
     dispatch(showAlert({type: "error", message: "Error fetching stories"}))
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleOpenViewer = (userStories) => {
    
     dispatch(setCurrentStories(userStories));
    setIsStoryViewerOpen(true);
  };

 

  return (
    <div className="relative">
      <div className="flex space-x-4 overflow-x-scroll p-4">
        <StoryUploadCircle handleOpenViewer={handleOpenViewer} setIsCreateStoryVisible={setIsCreateStoryVisible} />
        {stories?.map((story, index) => (
          <StoryCircle
            key={index}
            story={story}
            onClick={() => handleOpenViewer(story.stories)}
          />
        ))}
      </div>  
    </div>
  );
};

export default StoryContainer;
