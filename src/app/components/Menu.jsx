import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import UserProfile from "./ProfilePreview";
import MenuList from "./MenuList";
import axios from "axios";
import { clearUser } from "@/redux/userSlice";
import { showAlert } from "@/redux/alertSlice";
import MenuSkeleton from "./skeletons/MenuSkeleton";
import EditProfile from "./EditProfile";
import Profile from "./Profile";

const Menu = () => {
  const dispatch = useDispatch();
  const [view, setView] = useState("default"); // "default", "editProfile", "profile"
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useSelector((state) => state.user.user);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/profile");
        if (response.status === 200) {
          setUser(response.data.data);
        }
      } catch (error) {
        dispatch(showAlert({type: 'error', message: "Error fetching user"}))
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/auth/logout");
      if (response.status === 200) {
        dispatch(clearUser());
        dispatch(showAlert({ type: "success", message: "Logged out successfully" }));
        window.location.href = "/auth";
      }
    } catch (error) {
    
      dispatch(
        showAlert({ type: "error", message: "Problem occurred while logging out" })
      );
    }
  };

  // Handle menu selection
  const handleMenuSelect = (menuItem) => {
    switch (menuItem) {
      case "logout":
        handleLogout();
        break;
      case "profile":
        setView("profile");
        break;
      case "editProfile":
        setView("editProfile");
        break;
      default:
        setView("default");
    }
  };

  // Render content based on view
  const renderContent = () => {
    if (isLoading) {
      return <MenuSkeleton />;
    }

    switch (view) {
      case "editProfile":
        return <EditProfile user={user} onCancel={() => setView("default")} />;
      case "profile":
        return <Profile user={user} me={true} onBack={() => setView("default")} />;
      default:
        return (
          <>
            <UserProfile
              me={true}
              user={user || currentUser}
              onLogout={handleLogout}
              onEditProfile={() => handleMenuSelect("editProfile")}
            />
            <MenuList onMenuSelect={handleMenuSelect} />
          </>
        );
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", paddingBottom: 15 }}>
      {renderContent()}
    </Box>
  );
};

export default Menu;
