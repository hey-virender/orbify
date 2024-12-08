// GlobalAlert.js
"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Alert} from "@mui/material";
import { hideAlert } from "@/redux/alertSlice";

const GlobalAlert = () => {
  const dispatch = useDispatch();
  const { error, success, warning } = useSelector((state) => state.alert);

  // Automatically hide alert after 3000ms
  useEffect(() => {
    if (error || success || warning) {
      const timer = setTimeout(() => {
        dispatch(hideAlert());
      }, 3000);
      return () => clearTimeout(timer); // Clean up timer on unmount
    }
  }, [error, success, warning, dispatch]);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-12 z-50">
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      {warning && <Alert severity="warning">{warning}</Alert>}
    </div>
  );
};

export default GlobalAlert;
