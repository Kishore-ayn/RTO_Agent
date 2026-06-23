import {
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import {
  getDashboardStats,
} from "../services/dashboardService";

export default function Dashboard() {

  const [stats, setStats] =
    useState({
      total_vehicles: 0,
      fc_due: 0,
      np_due: 0,
      permit_due: 0,
      insurance_due: 0,
    });

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

      <Typography
        variant="h4"
        gutterBottom
      >
        Dashboard
      </Typography>

      <Grid
        container
        spacing={3}
      >

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Total Vehicles
              </Typography>

              <Typography variant="h4">
                {stats.total_vehicles}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                FC Due
              </Typography>

              <Typography variant="h4">
                {stats.fc_due}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                NP Due
              </Typography>

              <Typography variant="h4">
                {stats.np_due}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Permit Due
              </Typography>

              <Typography variant="h4">
                {stats.permit_due}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      <Grid
        container
        spacing={3}
        sx={{ mt: 1 }}
      >

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Insurance Due
              </Typography>

              <Typography variant="h4">
                {stats.insurance_due}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

    </Layout>
  );
}