import { useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { GoPlus } from "react-icons/go";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import handleOutsideClick from "../helper/handleOutsideClick";
import { setMyStories } from "@/redux/contentSlice";
import { showAlert } from "@/redux/alertSlice";

const StoryUploadCircle = ({ handleOpenViewer, setIsCreateStoryVisible }) => {
  const dispatch = useDispatch();
  const { myStories } = useSelector((state) => state.content);
  const [hasStory, setHasStory] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popup = useRef(null);
  const userId = useSelector((state) => state.user.user.id);

  const checkIfUserHasStory = async (id) => {
    try {
      const response = await axios.get(`/api/story/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        dispatch(setMyStories(response.data.stories));
        setHasStory(response.data.stories.length > 0);
      }
    } catch (error) {
      dispatch(showAlert({type: "error", message:"An error occurred"}));
    }
  };

  useEffect(() => {
    if (hasStory && showPopup) {
      const cleanup = handleOutsideClick(popup, () => {
        setShowPopup(false);
      });
      return cleanup;
    }
  }, [hasStory, showPopup]);

  useEffect(() => {
    async function fetchData() {
      try {
        await checkIfUserHasStory(userId);
      } catch (error) {
        dispatch(showAlert({type: "error", message:"An error occurred"}));
      }
    }
    fetchData();
  }, [userId]);

  const handleClick = () => {
    if (!hasStory) {
      setIsCreateStoryVisible(true);
    } else {
      setShowPopup(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Box
        onClick={handleClick}
        sx={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          position: "relative",
          border: `${hasStory ? "2px solid lightblue" : "2px dashed black"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 1,
          cursor: "pointer",
        }}
      >
        {showPopup && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "lightblue",
              padding: "10px",
              borderRadius: "50%",
              border: "1px solid gray",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              zIndex: 999,
            }}
          >
            <div ref={popup} className="flex flex-col items-center">
              <Button
                color="success"
                onClick={() => handleOpenViewer(myStories)}
              >
                View
              </Button>
              <Button
                color="secondary"
                onClick={() => setIsCreateStoryVisible(true)}
              >
                Create
              </Button>
            </div>
          </Box>
        )}
        {hasStory ? (
          <FaUserCircle className="text-5xl" />
        ) : (
          <GoPlus className="text-5xl" />
        )}
      </Box>
      <p className="text-xs mt-1">You</p>
    </div>
  );
};

export default StoryUploadCircle;
