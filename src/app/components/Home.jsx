"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

// Import Components
import Header from "./Header";
import StoryContainer from "./StoryContainer";
import PostSection from "./PostSection";
import CreatePost from "./CreatePost";
import PostSectionSkeleton from "./skeletons/PostSectionSkeleton";
import StoryUploader from "./StoryUploader";
import StoryViewer from "./StoryViewer";
import SearchSection from "./SearchSection";
import { showAlert } from "@/redux/alertSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);
  const [isCreateStoryVisible, setIsCreateStoryVisible] = useState(false);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [isSearchSectionOpen, setIsSearchSectionOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/post");
      setPosts(response.data.posts);
    } catch (error) {
     dispatch(showAlert({type: 'error', message: "Error fetching posts"}))
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to close the story viewer
  const handleCloseStoryViewer = () => setIsStoryViewerOpen(false);

  // Function to handle search section toggle
  const showSearchSection = () => setIsSearchSectionOpen(true);
  const hideSearchSection = () => setIsSearchSectionOpen(false);

  return (
    <div>
      <Header onSearch={showSearchSection} />

      {/* Conditional Rendering of Create Post, Story, and Search Sections */}
      {isCreatePostVisible && <CreatePost setIsCreatePostVisible={setIsCreatePostVisible} />}
      {isCreateStoryVisible && <StoryUploader onClose={() => setIsCreateStoryVisible(false)} />}
      {isStoryViewerOpen && <StoryViewer onClose={handleCloseStoryViewer} />}
      {isSearchSectionOpen && <SearchSection onClose={hideSearchSection} />}

      {/* Main Content (Only displayed if no modal is open) */}
      {!isCreatePostVisible && !isCreateStoryVisible && !isStoryViewerOpen && !isSearchSectionOpen && (
        <>
          <StoryContainer
            setIsStoryViewerOpen={setIsStoryViewerOpen}
            setIsCreateStoryVisible={setIsCreateStoryVisible}
          />
          {loading ? (
            <PostSectionSkeleton />
          ) : (
            <PostSection
              setIsCreatePostVisible={setIsCreatePostVisible}
              posts={posts}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Home;
