import {  Card,  CardContent,  Grid,  Typography,} from "@mui/material";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import {  getDashboardStats,} from "../services/dashboardService";
import {  DirectionsCarFilled,  SecurityOutlined,  Description,  Warning,  LocalShipping,} from "@mui/icons-material";
import {  Box, Paper, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import dashboardBanner from "../assets/dashboard-banner.png";
import { getVehicles } from "../services/vehicleService";

function DashboardCard({
  title,
  value,
  icon,
  subtitle,
  onClick,
  iconBg,
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        borderRadius: 1,
        border: "1px solid #E5E7EB",
        boxShadow:
          "0 4px 20px rgba(0,0,0,0.06)",
        height: "100%",

        transition: "all 0.3s ease",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            "0 12px 30px rgba(0,0,0,0.10)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              backgroundColor: iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ mt: 0.5 }}
            >
              {value}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mt: "auto",
            pt: 2,
            height: 24,
            //overflow: "hidden",
          }}
        >
          <svg
            width="100%"
            height="24"
            viewBox="0 0 200 24"
            preserveAspectRatio="none"
          >
            <path
              d="M0 16 Q10 4 20 16 T40 16 T60 16 T80 16 T100 16 T120 16 T140 16 T160 16 T180 16 T200 16"
              fill="none"
              stroke={icon.props.sx.color}
              strokeWidth="2"
            />
          </svg>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {

  const { logout } = useAuth();

  const [stats, setStats] =
    useState({
      total_vehicles: 0,
      fc_due: 0,
      np_due: 0,
      permit_due: 0,
      insurance_due: 0,
    });
  
  const navigate = useNavigate(); 
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

    const [recentVehicles, setRecentVehicles] =
  useState([]);

  const [upcomingAlerts, setUpcomingAlerts] =
  useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();

      setStats(data);

      setUpcomingAlerts([
        {
          title: "Insurance",
          count: data.insurance_due,
          color: "#DC2626",
        },
        {
          title: "FC",
          count: data.fc_due,
          color: "#16A34A",
        },
        {
          title: "Permit",
          count: data.permit_due,
          color: "#EA580C",
        },
        {
          title: "NP",
          count: data.np_due,
          color: "#7C3AED",
        },
      ]);
    } catch (error) {
      console.error(error);
    }

    try {
      const vehicles = await getVehicles();

      console.log(vehicles);

      setRecentVehicles(
        vehicles.slice(0, 5)
      );
    } catch (error) {
      console.error(
        "Vehicle Loading Error:",
        error
      );
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
        >
          Dashboard
        </Typography>

        <Button
          variant="outlined"
          onClick={handleLogout}
          sx={{
            borderRadius: "16px",
            px: 3,
            py: 1.2,
            borderColor: "#E9D5FF",
            color: "#7C3AED",
            fontWeight: 700,
          }}
        >
          Logout
        </Button>
      </Box>

      <Paper
        sx={{
          mb: 4,
          p: 5,
          borderRadius: 1,
          background:
            "linear-gradient(135deg,#F5F3FF,#EDE9FE)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 100,
          overflow: "hidden",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={400}
            mb={4}
          >
            Welcome back, Agent! 👋
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            Monitor vehicle registrations,
            permits, insurance renewals and
            fitness certificate expiries from
            a single dashboard.
          </Typography>
        </Box>

        <Box
          component="img"
          src={dashboardBanner}
          alt="Dashboard Banner"
          sx={{
            width: "100%",
            maxWidth: 500,
            height:100,
            objectFit: "contain",
          }}
        />
      </Paper>      

      <Grid
        container
        spacing={1}
        wrap = "nowrap"
      >

        <Grid item sx={{ flex: 1 }}>
          <DashboardCard
            title="Total Vehicles"
            subtitle="All Registered"
            value={stats.total_vehicles}
            iconBg="#F3E8FF"
            icon={
              <DirectionsCarFilled
                sx={{
                  color: "#7C3AED",
                  fontSize: 20,
                }}
              />
            }
          />
        </Grid>

        <Grid item sx={{ flex: 1 }}>
          <DashboardCard
            title="FC Due"
            subtitle="Due Soon"
            value={stats.fc_due}
            iconBg="#DCFCE7"
            icon={
              <SecurityOutlined
                sx={{
                  color: "#7C3AED",
                  fontSize: 20,
                }}
              />
            }
            onClick={() =>
              navigate(
                "/expiry-alerts?tab=fc"
              )
            }
          />
        </Grid>



        <Grid item sx={{ flex: 1 }}>
          <DashboardCard
            title="Permit Due"
            subtitle="Due Soon"
            value={stats.permit_due}
            iconBg="#FFEDD5"
            icon={
              <Description
                sx={{
                  color: "#EA580C",
                  fontSize: 20,
                }}
              />
            }
            onClick={() =>
              navigate(
                "/expiry-alerts?tab=permit"
              )
            }
          />
        </Grid>


        <Grid item sx={{ flex: 1 }}>
          <DashboardCard
            title="Insurance Due"
            subtitle="Due Soon"
            value={stats.insurance_due}
            iconBg="#EDE9FE"
            icon={
              <Warning
                sx={{
                  color: "#7C3AED",
                  fontSize: 20,
                }}
              />
            }
            onClick={() =>
              navigate(
                "/expiry-alerts?tab=insurance"
              )
            }
          />
        </Grid>

        <Grid item sx={{ flex: 1 }}>
          <DashboardCard
            title="NP Due"
            subtitle="Due Soon"
            value={stats.np_due}
            iconBg="#FEE2E2"
            icon={
              <LocalShipping
                sx={{
                  color: "#DC2626",
                  fontSize: 20,
                }}
              />
            }
            onClick={() =>
              navigate(
                "/expiry-alerts?tab=np"
              )
            }
          />
        </Grid>

      </Grid> 

      <Grid
        container
        spacing={3}
        sx={{ mt: 2 }}
      > 

        <Grid item sx={{ flex: 1 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 1,
              minHeight: 420,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              mb={3}
            >
              Recent Vehicles
            </Typography>
            <Box sx={{ flexGrow: 1}}>
              {recentVehicles.map((vehicle) => (
                <Box
                  key={vehicle.VEHICLE_ID}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 2,
                    borderBottom:
                      "1px solid #F1F5F9",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        backgroundColor:
                          "#F3E8FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <DirectionsCarFilled
                        sx={{
                          color: "#7C3AED",
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        fontWeight={600}
                      >
                        {
                          vehicle.VEHICLE_NUMBER
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {
                          vehicle.OWNER_NAME
                        }
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 10,
                      background: "linear-gradient(135deg,#DCFCE7,#BBF7D0)",
                      boxShadow:
                        "0 4px 12px rgba(34,197,94,0.15)",
                      color: "#15803D",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    Active
                  </Box>
                </Box>
            ))}
            </Box>

            <Button
              fullWidth
              sx={{
                mt: 2,
                color: "#7C3AED",
                fontWeight: 700,
              }}
              onClick={() =>
                navigate("/vehicle-list")
              }
            >
              View All Vehicles →
            </Button>
          </Paper>
        </Grid>

        <Grid item sx={{ flex: 1 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 1,
              height: 420,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Upcoming Expiry Alerts
              </Typography>

              <Button
                size="small"
                onClick={() =>
                  navigate(
                    "/expiry-alerts"
                  )
                }
              >
                View All
              </Button>
            </Box>

            {upcomingAlerts.map(
              (alert, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    py: 2,
                    borderBottom:
                      "1px solid #F1F5F9",
                  }}
                >
                  <Box>
                    <Typography
                      fontWeight={600}
                    >
                      {alert.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Renewal Pending
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 10,
                      backgroundColor:
                        `${alert.color}15`,
                      color:
                        alert.color,
                      fontWeight: 700,
                    }}
                  >
                    {alert.count}
                  </Box>
                </Box>
              )
            )}
          </Paper>
        </Grid>



      </Grid>



    </Layout>
  );
}