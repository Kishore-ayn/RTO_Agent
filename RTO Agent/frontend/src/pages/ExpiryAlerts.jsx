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
  getNpDueVehicles
} from "../services/dashboardService";

import {
  useSearchParams,
} from "react-router-dom";

export default function ExpiryAlerts() {

  const [tab, setTab] =
    useState(0);

  const [rows, setRows] =
    useState([]);

  const [searchParams] =
  useSearchParams();  

  useEffect(() => {

    const tabName =
      searchParams.get("tab");

    if (tabName === "fc") {
      setTab(0);
      loadFcDue();
      return;
    }

    if (tabName === "permit") {
      setTab(1);
      loadPermitDue();
      return;
    }

    if (tabName === "insurance") {
      setTab(2);
      loadInsuranceDue();
      return;
    }

    if (tabName === "np") {
      setTab(3);
      loadNPDue();
      return;
    }

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

  const loadNPDue =
  async () => {
    const data =
      await getNpDueVehicles();

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

    if (value === 3)
      loadNPDue();
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
    {
      field: "expiryDate",
      headerName: "Expiry Date",
      width: 150,

      valueGetter: (value, row) => {

        if (tab === 0)
          return row.FC_EXPIRY_DATE;

        if (tab === 1)
          return row.PERMIT_EXPIRY_DATE;

        if (tab === 2)
          return row.INSURANCE_EXPIRY;

        if (tab === 3)
          return row.NP_EXPIRY_DATE;

        return "";
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 180,

      renderCell: (params) => {

        let expiryDate = null;

        if (tab === 0)
          expiryDate =
            params.row.FC_EXPIRY_DATE;

        if (tab === 1)
          expiryDate =
            params.row.PERMIT_EXPIRY_DATE;

        if (tab === 2)
          expiryDate =
            params.row.INSURANCE_EXPIRY;

        if (tab === 3)
          expiryDate =
            params.row.NP_EXPIRY_DATE;

        if (!expiryDate)
          return "No Date";

        const today =
          new Date();

        const expiry =
          new Date(expiryDate);

        const diffDays =
          Math.ceil(
            (expiry - today) /
            (1000 * 60 * 60 * 24)
          );

        if (diffDays < 0) {

          return (
            <span
              style={{
                color: "red",
                fontWeight: "bold",
              }}
            >
              Expired
            </span>
          );
        }

        if (diffDays <= 7) {

          return (
            <span
              style={{
                color: "orange",
                fontWeight: "bold",
              }}
            >
              {diffDays} Days Left
            </span>
          );
        }

        return (
          <span
            style={{
              color: "#d4a017",
              fontWeight: "bold",
            }}
          >
            {diffDays} Days Left
          </span>
        );
      },
    }
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

        <Tab 
          label="NP Due" 
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