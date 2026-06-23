import {
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <Typography
        variant="h4"
        gutterBottom
      >
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Total Vehicles
              </Typography>

              <Typography variant="h4">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                FC Due
              </Typography>

              <Typography variant="h4">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Permit Due
              </Typography>

              <Typography variant="h4">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}