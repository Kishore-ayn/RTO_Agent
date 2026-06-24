import {  Box,  Drawer,  List,  ListItem,  ListItemButton,  ListItemText, ListItemIcon,} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {  Dashboard,  DirectionsCar,  ListAlt,  Warning,} from "@mui/icons-material";
import {  useLocation,} from "react-router-dom";
import Typography from "@mui/material/Typography";

const drawerWidth = 240;

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Navbar />

      <Box sx={{ display: "flex" }}>
        
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              borderBottom:
                "1px solid #eee",
            }}
          >

            <Typography
              variant="h6"
              fontWeight="bold"
            >
              RTO Agent
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Management System
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
                  navigate(
                    "/dashboard"
                  )
                }
              >

                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>

                <ListItemText
                  primary="Dashboard"
                />

              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                selected={
                  location.pathname ===
                  "/vehicle-entry"
                }
                onClick={() =>
                  navigate(
                    "/vehicle-entry"
                  )
                }
              >
                <ListItemIcon>
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
              >
                <ListItemIcon>
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
              >

                <ListItemIcon>
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
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}