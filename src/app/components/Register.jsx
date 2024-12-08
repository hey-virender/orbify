import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { showAlert } from "@/redux/alertSlice";
import debounce from "lodash/debounce";
import axios from "axios";

// Validation schema with Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Register = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = debounce(async (values) => {
    setLoading(true);
    const jsonData = JSON.stringify(values);
    try {
      const response = await axios.post("/api/auth/register", jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        
        dispatch(
          showAlert({ type: "success", message: response.data.message })
        );
        window.location.href = `/verify-email?email=${values.email}`;
      }
    } catch (error) {
    
      if (error.response && error.response.status === 400) {
        
        dispatch(showAlert({ type: "error", message: error.response.message }));
        // Redirect to the email verification page with email in query string
      } else {
        dispatch(showAlert({ type: "error", message: error.response.message }));
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
        Register
      </Typography>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          errors,
        }) => (
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Name"
              type="text"
              name="name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={<ErrorMessage name="name" component="div" />}
            />
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
              error={touched.email && Boolean(errors.email)}
              helperText={<ErrorMessage name="email" component="div" />}
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
              error={touched.password && Boolean(errors.password)}
              helperText={<ErrorMessage name="password" component="div" />}
            />
            <TextField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              variant="outlined"
              fullWidth
              margin="normal"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={
                <ErrorMessage name="confirmPassword" component="div" />
              }
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              {loading ? <CircularProgress color="white" /> : "Register"}
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
