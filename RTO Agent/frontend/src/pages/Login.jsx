import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  DirectionsBusFilledTwoTone,
} from "@mui/icons-material";

import { login as loginApi } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    try {
      const response =
        await loginApi({
          username,
          password,
        });

      if (!response.access_token) {
        alert(
          response.message || "Login Failed"
        );
        return;
      }

      login(
        response.access_token
      );

      navigate("/dashboard");

    } catch (error) {

      alert("Login Failed");

    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#F5F3FF,#EDE9FE,#F8FAFC)",
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1100,
          display: "flex",
          overflow: "hidden",
          borderRadius: 6,
          border:
            "1px solid rgba(255,255,255,0.4)",
          backdropFilter:
            "blur(20px)",
          boxShadow:
            "0 25px 50px rgba(0,0,0,0.12)",
        }}
      >

        {/* Left Side */}
        <Box
          sx={{
            flex: 1,
            background:
              "linear-gradient(135deg,#7C3AED,#9333EA)",
            color: "white",
            p: 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: 4,
              background:
                "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <DirectionsBusFilledTwoTone
              sx={{
                fontSize: 50,
              }}
            />
          </Box>

          <Typography
            variant="h5"
            fontWeight={800}
            mb={2}
          >
            RTO Management
          </Typography>

          <Typography
            sx={{
              lineHeight: 1.8,
            }}
          >
            Manage vehicle registrations,
            permits, insurance renewals,
            fitness certificates and
            compliance tracking from one
            centralized dashboard.
          </Typography>

          <Box
            sx={{
              mt: 5,
              display: "flex",
              gap: 2,
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                background:
                  "rgba(255,255,255,0.15)",
              }}
            >
              Vehicle Records
            </Box>

            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                background:
                  "rgba(255,255,255,0.15)",
              }}
            >
              Expiry Alerts
            </Box>

            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                background:
                  "rgba(255,255,255,0.15)",
              }}
            >
              Dashboard
            </Box>
          </Box>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box width="100%">
            <Typography
              variant="h6"
              fontWeight={800}
              mb={2}
            >
              Prakash Transport 👋
            </Typography>

            <Typography
              color="text.secondary"
              mb={4}
            >
              Sign in to continue
            </Typography>

            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              sx={{
                mb: 3,
              }}
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              sx={{
                mb: 4,
              }}
            />

            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleLogin}
              sx={{
                py: 1.6,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: "1rem",
                background:
                  "linear-gradient(135deg,#7C3AED,#9333EA)",
                boxShadow:
                  "0 12px 25px rgba(124,58,237,0.35)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg,#6D28D9,#7E22CE)",
                },
              }}
            >
              Login
            </Button>

            <Typography
              align="center"
              color="text.secondary"
              sx={{
                mt: 3,
                fontSize: "0.9rem",
              }}
            >
              Secure access to your RTO
              Management System
            </Typography>
          </Box>
        </Box>

      </Paper>
    </Box>
  );
}