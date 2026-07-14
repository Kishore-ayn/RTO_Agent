import { useState } from "react";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import Layout from "../components/Layout";

import { changePassword } from "../services/authService";

export default function ChangePassword() {

  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleSubmit = async () => {

    if (
      !oldPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert(
        "New Password and Confirm Password do not match"
      );
      return;
    }

    try {

      const response = await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });

      alert(response.message);

      if (
        response.message ===
        "Password Changed Successfully"
      ) {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

    } catch (error) {

      console.error(error);

      alert("Error Changing Password");
    }
  };

  return (
    <Layout>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: 480,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
        >
          Change Password
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Update your account password
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            value={oldPassword}
            onChange={(e) =>
              setOldPassword(e.target.value)
            }
          />

          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
          />

          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 1,
              borderRadius: 3,
              alignSelf: "flex-start",
              px: 4,
            }}
            onClick={handleSubmit}
          >
            Update Password
          </Button>
        </Box>
      </Paper>
    </Layout>
  );
}
