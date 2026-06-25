import {  Box,  Drawer,  List,  ListItem,  ListItemButton,  ListItemText, ListItemIcon,} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {  DashboardCustomize,  DirectionsCar,  ListAlt,  Warning,  } from "@mui/icons-material";
import {  useLocation,} from "react-router-dom";
import Typography from "@mui/material/Typography";



export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (


      <Box sx={{ display: "flex" }}>
        
      <Drawer
        variant="permanent"
        sx={{
          width: 280,

          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: 280,

            overflowX: "hidden",
            transition:
              "width 0.3s ease",

            boxSizing: "border-box",
            backgroundColor: "#FFFFFF",

            boxShadow:
              "0 8px 30px rgba(0,0,0,0.06)",

            borderRight: "none",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #eee",
          }}
        >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "16px",
            background:
              "linear-gradient(135deg,#7C3AED,#A855F7)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "1.2rem",
            mb: 2,
          }}
        >
          PT
        </Box>

        <Typography
          variant="h6"
          fontWeight={800}
        >
          Prakash Transport
        </Typography>


        </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={
                  location.pathname ===
                  "/dashboard"
                }
                onClick={() =>
                  navigate("/dashboard")
                }
                sx={{
                  mx: 1,
                  mb: 1,
                  borderRadius: 3,

                  "&.Mui-selected": {
                    background:
                      "linear-gradient(135deg,#7C3AED,#A855F7)",
                    color: "#fff",
                  },

                  "&.Mui-selected .MuiListItemIcon-root":
                    {
                      color: "#fff",
                    },
                }}
              >

                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    justifyContent: "center",
                  }}
                >
                  <DashboardCustomize />
                </ListItemIcon>


                  <ListItemText
                    primary="Dashboard"
                  />


              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                selected={
                  location.pathname.startsWith(
                    "/vehicle-entry"
                  )
                }
                onClick={() =>
                  navigate(
                    "/vehicle-entry"
                  )
                }
                  sx={{
                  mx: 1,
                  mb: 1,
                  borderRadius: 3,

                  "&.Mui-selected": {
                    background:
                      "linear-gradient(135deg,#7C3AED,#A855F7)",
                    color: "#fff",
                  },

                  "&.Mui-selected .MuiListItemIcon-root":
                    {
                      color: "#fff",
                    },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    justifyContent: "center",
                  }}
                >
                  <DirectionsCar />
                </ListItemIcon>


                    <ListItemText
                      primary="Vehicle Entry"
                    />

              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                selected={
                  location.pathname ===
                  "/vehicle-list"
                }
                onClick={() =>
                  navigate(
                    "/vehicle-list"
                  )
                }
                sx={{
                  mx: 1,
                  mb: 1,
                  borderRadius: 3,

                  "&.Mui-selected": {
                    background:
                      "linear-gradient(135deg,#7C3AED,#A855F7)",
                    color: "#fff",
                  },

                  "&.Mui-selected .MuiListItemIcon-root":
                    {
                      color: "#fff",
                    },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    justifyContent: "center",
                  }}
                >
                  <ListAlt />
                </ListItemIcon>


                    <ListItemText
                      primary="Vehicle List"
                    />

              </ListItemButton>
            </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={
                location.pathname ===
                "/expiry-alerts"
              }
              onClick={() =>
                navigate(
                  "/expiry-alerts"
                )
              }
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: 3,

                "&.Mui-selected": {
                  background:
                    "linear-gradient(135deg,#7C3AED,#A855F7)",
                  color: "#fff",
                },

                "&.Mui-selected .MuiListItemIcon-root":
                  {
                    color: "#fff",
                  },
              }}
            >

              <ListItemIcon
                sx={{
                  minWidth: 40,
                  justifyContent: "center",
                }}
              >
                <Warning />
              </ListItemIcon>


                  <ListItemText
                    primary="Expiry Alerts"
                  />

            </ListItemButton>
          </ListItem>
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            backgroundColor: "#F8FAFC",
            minHeight: "100vh",
          }}
        >
          {children}
        </Box>
      </Box>
    
  );
}