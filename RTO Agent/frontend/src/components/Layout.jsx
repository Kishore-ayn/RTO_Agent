import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";

const drawerWidth = 240;

export default function Layout({ children }) {
  const navigate = useNavigate();

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
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                <ListItemText
                  primary="Dashboard"
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() =>
                  navigate("/vehicle-entry")
                }
              >
                <ListItemText
                  primary="Vehicle Entry"
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() =>
                  navigate("/vehicle-list")
                }
              >
                <ListItemText
                  primary="Vehicle List"
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