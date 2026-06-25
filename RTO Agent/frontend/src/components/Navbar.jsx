import {
  Box,
  Typography,
  Button,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    mb: 5,
  }}
>
  <Box>
    <Typography
      variant="h3"
      fontWeight={800}
    >
      Welcome Back 👋
    </Typography>

    <Typography
      color="text.secondary"
      sx={{ mt: 1 }}
    >
      Monitor vehicle renewals,
      permits and insurance status.
    </Typography>
  </Box>

  <Button
    variant="contained"
    onClick={handleLogout}
    sx={{
      borderRadius: "14px",
      px: 3,
      py: 1.2,
      background:
        "linear-gradient(135deg,#7C3AED,#9333EA)",
    }}
  >
    Logout
  </Button>
</Box>
  );
}