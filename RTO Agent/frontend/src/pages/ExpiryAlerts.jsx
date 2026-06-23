import {
  Typography,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";

import {
  DataGrid,
} from "@mui/x-data-grid";

import {
  useEffect,
  useState,
} from "react";

import Layout from "../components/Layout";

import {
  getFcDueVehicles,
  getPermitDueVehicles,
  getInsuranceDueVehicles,
} from "../services/dashboardService";

export default function ExpiryAlerts() {

  const [tab, setTab] =
    useState(0);

  const [rows, setRows] =
    useState([]);

  useEffect(() => {
    loadFcDue();
  }, []);

  const loadFcDue = async () => {
    const data =
      await getFcDueVehicles();

    setRows(data);
  };

  const loadPermitDue =
    async () => {
      const data =
        await getPermitDueVehicles();

      setRows(data);
    };

  const loadInsuranceDue =
    async () => {
      const data =
        await getInsuranceDueVehicles();

      setRows(data);
    };

  const handleTabChange = (
    event,
    value
  ) => {

    setTab(value);

    if (value === 0)
      loadFcDue();

    if (value === 1)
      loadPermitDue();

    if (value === 2)
      loadInsuranceDue();
  };

  const columns = [
    {
      field:
        "VEHICLE_NUMBER",
      headerName:
        "Vehicle Number",
      width: 180,
    },
    {
      field:
        "OWNER_NAME",
      headerName:
        "Owner Name",
      width: 180,
    },
    {
      field:
        "OWNER_CONTACT",
      headerName:
        "Contact",
      width: 150,
    },
  ];

  return (
    <Layout>

      <Typography
        variant="h4"
        gutterBottom
      >
        Expiry Alerts
      </Typography>

      <Tabs
        value={tab}
        onChange={
          handleTabChange
        }
      >
        <Tab
          label="FC Due"
        />

        <Tab
          label="Permit Due"
        />

        <Tab
          label="Insurance Due"
        />
      </Tabs>

      <Paper
        sx={{
          mt: 2,
          height: 600,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) =>
            row.VEHICLE_ID
          }
        />
      </Paper>

    </Layout>
  );
}