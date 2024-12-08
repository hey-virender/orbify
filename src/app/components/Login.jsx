import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import debounce from "lodash/debounce";
import { useDispatch } from "react-redux";
import { showAlert } from "@/redux/alertSlice";

import { setUser } from "@/redux/userSlice"; // Action to set user

// Validation schema with Yup
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounced validation function
  const handleSubmit = debounce(async (values) => {
    setLoading(true);
    const jsonData = JSON.stringify(values);
    try {
      const response = await axios.post("/api/auth/login", jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        
        const {
          id,
          message,
          name,
          profilePicture,
          email,
          posts,
          followers,
          following,
        } = response.data;

        const user = {
          name,
          id,
          profilePicture,
          email,
          posts,
          followers,
          following,
        };
       
      

        // Dispatch the setUser action to store user data in Redux
        dispatch(setUser(user));

        dispatch(showAlert({ type: "success", message }));

        // Redirect to the dashboard after successful login
        window.location.href = "/dashboard";
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Redirect to email verification page with the email
        setEmail(values.email);
        dispatch(
          showAlert({ type: "error", message: "Please verify your email" })
        );
        window.location.href = `/verify-email?email=${values.email}`;
      } else if (error.response && error.response.status === 403) {
        dispatch(showAlert({ type: "error", message: "Invalid credentials" }));
      } else if (error.response && error.response.status === 404) {
        dispatch(showAlert({ type: "error", message: "User not found" }));
      } else {
        dispatch(showAlert({ type: "error", message: "Invalid credentials" }));
        
      }
    } finally {
      setLoading(false);
    }
  }, 300); // 300ms delay

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        maxWidth: 400,
        margin: "auto",
      }}
    >
      <Typography variant="h3" component="h1">
        Login
      </Typography>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={true} // Validate only on blur
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
        }) => (
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Email"
              type="email"
              name="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email ? errors.email : ""}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.password && errors.password)}
              helperText={
                touched.password && errors.password ? errors.password : ""
              }
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              {loading ? <CircularProgress color="white" /> : "Login"}
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
