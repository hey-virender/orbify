"use client";
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showAlert } from "@/redux/alertSlice";

const EmailVerification = () => {
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(window.location.search);
  const emailFromURL = queryParams.get("email");
  useEffect(() => {

    if (emailFromURL) {
      sendVerificationMail(emailFromURL);
    }
  }, []);

  const sendVerificationMail = async (email) => {
    try {
      const response = await axios.post("/api/auth/send-verification", {
        email,
      });
      if (response.status === 200) {
       
        dispatch(
          showAlert({
            message: "Verification mail sent successfully",
            type: "success",
          })
        );
      }
    } catch (error) {
      
      dispatch(
        showAlert({ message: "Error while sending mail", type: "error" })
      );
    }
  };

  return (
    <div className="w-1/3 mx-auto text-center">
      <Typography variant="h3" component="h3">
        Verify your email
      </Typography>
      <Typography variant="body1" component="p">
        We have sent you a verification link to your email. Please check your
        email and click on the link to verify your email.
      </Typography>
      <Button onClick={() => sendVerificationMail(emailFromURL)}>
        Resend{" "}
      </Button>
      <Button onClick={() => (window.location.href = "/auth")}>
        Back to Login
      </Button>
    </div>
  );
};

export default EmailVerification;
