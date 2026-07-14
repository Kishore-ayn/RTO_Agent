import {
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
} from "@mui/material";

import {
  DataGrid,
} from "@mui/x-data-grid";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";

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

  const getExpiryDate = (row) => {
    if (tab === 0) return row.FC_EXPIRY_DATE;
    if (tab === 1) return row.PERMIT_EXPIRY_DATE;
    if (tab === 2) return row.INSURANCE_EXPIRY;
    if (tab === 3) return row.NP_EXPIRY_DATE;
    return null;
  };

  const getDocLabel = () => {
    if (tab === 0) return "FC (Fitness Certificate)";
    if (tab === 1) return "Permit";
    if (tab === 2) return "Insurance";
    if (tab === 3) return "NP (National Permit)";
    return "document";
  };

  const sendWhatsApp = (row) => {
    const digits = String(row.OWNER_WHATSAPP || "").replace(/\D/g, "");
    const phone = digits.length === 10 ? `91${digits}` : digits;

    const expiryDate = getExpiryDate(row);
    const dateText = expiryDate
      ? new Date(expiryDate).toLocaleDateString("en-IN")
      : "N/A";

    const message =
      `Hello ${row.OWNER_NAME || "Sir/Madam"}, this is a reminder from ` +
      `Prakash Transport that the ${getDocLabel()} of your vehicle ` +
      `${row.VEHICLE_NUMBER} is expiring on ${dateText}. Please renew it ` +
      `at the earliest to avoid any inconvenience. Thank you.`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

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

      valueGetter: (value, row) => getExpiryDate(row) || "",
    },
    {
      field: "status",
      headerName: "Status",
      width: 180,

      renderCell: (params) => {
        const expiryDate = getExpiryDate(params.row);

        if (!expiryDate) {
          return (
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "999px",
                backgroundColor: "#F1F5F9",
                color: "#64748B",
                fontWeight: 600,
              }}
            >
              No Date
            </span>
          );
        }

        const today = new Date();
        const expiry = new Date(expiryDate);

        const diffDays = Math.ceil(
          (expiry - today) /
            (1000 * 60 * 60 * 24)
        );

        if (diffDays < 0) {
          return (
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "999px",
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                fontWeight: 700,
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
                padding: "4px 12px",
                borderRadius: "999px",
                backgroundColor: "#FFEDD5",
                color: "#EA580C",
                fontWeight: 700,
              }}
            >
              {diffDays} Days Left
            </span>
          );
        }

        return (
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "999px",
              backgroundColor: "#EDE9FE",
              color: "#7C3AED",
              fontWeight: 700,
            }}
          >
            {diffDays} Days Left
          </span>
        );
      }
    },
    {
      field: "whatsapp",
      headerName: "Notify Owner",
      width: 160,
      sortable: false,
      filterable: false,

      renderCell: (params) => {
        if (!params.row.OWNER_WHATSAPP) {
          return (
            <span
              style={{
                color: "#94A3B8",
                fontSize: "0.8rem",
              }}
            >
              No Number
            </span>
          );
        }

        return (
          <Button
            size="small"
            variant="outlined"
            startIcon={<WhatsAppIcon />}
            onClick={() => sendWhatsApp(params.row)}
            sx={{
              borderColor: "#25D366",
              color: "#25D366",
              fontWeight: 700,

              "&:hover": {
                backgroundColor: "#25D36615",
                borderColor: "#25D366",
              },
            }}
          >
            Notify
          </Button>
        );
      },
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