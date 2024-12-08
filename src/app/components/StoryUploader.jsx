import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showAlert } from "@/redux/alertSlice";

const StoryUploader = ({ onClose }) => {
  const dispatch = useDispatch();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setStory(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
   
    e.preventDefault();


    if (!story) {
      dispatch(
        showAlert({ type: "error", message: "Please select a story to upload" })
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("story", story);

      const response = await axios.post("/api/story", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        onClose();
        setLoading(false);
       
        dispatch(setMyStories(response.data.stories));
        dispatch(
          showAlert({ type: "success", message: "Story uploaded successfully" })
        );
      }
    } catch (error) {
      setLoading(false);
      dispatch(
        showAlert({ type: "error", message: "Error while uploading story" })
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <Box
        sx={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          width: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Upload Your Story
        </Typography>

        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          required
          className="mb-4 w-full border p-2 rounded-md"
        />

        <Button
          type="submit"
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ marginBottom: "10px" }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Upload Story"
          )}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </div>
  );
};

export default StoryUploader;
