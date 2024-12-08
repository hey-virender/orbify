"use client";
import React, {  useState } from "react";


import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Login from "../components/Login";
import Register from "../components/Register";
import { showAlert } from "@/redux/alertSlice"; // Assuming you have alertSlice setup

const Page = () => {

  const [currentPage, setCurrentPage] = useState("login");

  // Handle session expiration logic
  

  const handleToggleChange = (event, newValue) => {
    if (newValue !== null) {
      setCurrentPage(newValue);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
        gap: "0.5rem",
        padding: "0.5rem",
      }}
    >
      {/* Conditional rendering of Login and Register components */}
      {currentPage === "login" && <Login />}
      {currentPage === "register" && <Register />}

      {/* Toggle between Login and Register */}
      <ToggleButtonGroup value={currentPage} onChange={handleToggleChange} exclusive>
        <ToggleButton value="login">Login</ToggleButton>
        <ToggleButton value="register">Register</ToggleButton>
      </ToggleButtonGroup>

      {/* Toggle message */}
      <Typography variant="body2">
        {currentPage === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
        <Button
          type="text"
          onClick={() => setCurrentPage(currentPage === "login" ? "register" : "login")}
        >
          {currentPage === "login" ? "Create one now..." : "Login now..."}
        </Button>
      </Typography>
    </Box>
  );
};

export default Page;
