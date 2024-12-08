import React, { useState } from "react";
import { TextField, Button, IconButton, CircularProgress } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios"; // Import Axios
import { useDispatch } from "react-redux";
import { showAlert } from "@/redux/alertSlice";

const CreatePost = ({ setIsCreatePostVisible }) => {
  const dispatch = useDispatch(); 
  // State for form inputs
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle form submission using Axios
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Create a new FormData object
    const formData = new FormData();

    // Append content to the FormData
    formData.append("content", content);

    // Append media files to FormData (if provided)

    formData.append("media", media);

   
    try {
      // Axios POST request to create the post
      const response = await axios.post("/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check if the response was successful
      if (response.status === 201) {
        
        setIsCreatePostVisible(false); // Close the modal
      } else {
     dispatch(showAlert({type:"error", message:"Internal Server Error"}))
      }
    } catch (error) {
      dispatch(showAlert({type:"error", message:"Error while creating post"}))
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <IconButton
          onClick={() => setIsCreatePostVisible(false)} // Close modal
          className="absolute top-2 right-2 text-gray-600"
        >
          <IoIosCloseCircleOutline />
        </IconButton>

        <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          {/* Content */}
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            className="mb-4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          {/* Media Upload (optional) */}
          <div className="mb-4">
            <input
              type="file"
              onChange={(e) => setMedia(e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
          >
            {loading ? <CircularProgress color="white" /> : "Create Post"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
