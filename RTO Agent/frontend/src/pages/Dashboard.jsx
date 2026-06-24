import {  Card,  CardContent,  Grid,  Typography,} from "@mui/material";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import {  getDashboardStats,} from "../services/dashboardService";
import {  DirectionsCar,  Security,  Description,  Warning,  LocalShipping,} from "@mui/icons-material";
import {  Box,} from "@mui/material";


function DashboardCard({
  title,
  value,
  icon,
  onClick,
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        borderRadius: 4,
        boxShadow: 3,
        transition: "all 0.3s ease",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >

          <Box>

            <Typography
              color="text.secondary"
              gutterBottom
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {value}
            </Typography>

          </Box>

          {icon}

        </Box>

      </CardContent>
    </Card>
  );
}

export default function Dashboard() {

  const [stats, setStats] =
    useState({
      total_vehicles: 0,
      fc_due: 0,
      np_due: 0,
      permit_due: 0,
      insurance_due: 0,
    });
  
  const navigate = useNavigate();  

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {

      const data =
        await getDashboardStats();

      setStats(data);

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <Layout>
      <Box mb={4}>

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          RTO Management Dashboard
        </Typography>

        <Typography
          color="text.secondary"
        >
          Manage vehicle renewals, permits,
          insurance and customer records.
        </Typography>

      </Box>

      <Grid
        container
        spacing={3}
      >

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Vehicles"
            value={stats.total_vehicles}
            icon={
              <DirectionsCar
                fontSize="large"
              />
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="FC Due"
            value={stats.fc_due}
            icon={
              <Security
                fontSize="large"
              />
            }
            onClick={() =>
              navigate(
                "/expiry-alerts?tab=fc"
              )
            }
          />
        </Grid>



        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Permit Due"
            value={stats.permit_due}
            icon={
              <Description
                fontSize="large"
              />
            }
            onClick={() =>
              navigate(
                "/expiry-alerts?tab=permit"
              )
            }
          />
        </Grid>


        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Insurance Due"
            value={stats.insurance_due}
            icon={
              <Warning
                fontSize="large"
              />
            }
            onClick={() =>
              navigate(
                "/expiry-alerts?tab=insurance"
              )
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="NP Due"
            value={stats.np_due}
            icon={
              <LocalShipping
                fontSize="large"
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

    </Layout>
  );
}