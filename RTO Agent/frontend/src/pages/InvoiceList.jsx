import { useEffect, useState } from "react";

import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";

import Layout from "../components/Layout";

import {
  getInvoices,
  deleteInvoice,
} from "../services/invoiceService";

export default function InvoiceList() {
  const [invoices, setInvoices] =
    useState([]);

  const [searchText, setSearchText] =
  useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await getInvoices();

      setInvoices(data);
    } catch (error) {
      console.error("Invoice List Error:", error);
    }
    };

  const handleDelete = async (
    invoiceId
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this invoice?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await deleteInvoice(
        invoiceId
      );

      alert(
        "Invoice Deleted Successfully"
      );

      loadInvoices();

    } catch (error) {

      console.error(error);

      alert(
        "Error Deleting Invoice"
      );

    }
  };

  const columns = [
    {
      field: "INVOICE_NUMBER",
      headerName:
        "Invoice Number",
      width: 160,
    },
    {
      field: "CLIENT_NAME",
      headerName:
        "Client",
      width: 220,
    },
    {
      field: "INVOICE_DATE",
      headerName:
        "Date",
      width: 130,
      valueGetter: (value) =>
        value
          ? value.substring(0, 10)
          : "",
    },
    {
      field: "TOTAL_AMOUNT",
      headerName:
        "Total",
      width: 140,
      valueGetter: (value) =>
        value !== undefined && value !== null
          ? `₹${Number(value).toLocaleString("en-IN")}`
          : "",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,

      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            sx={{ mr: 1 }}
            onClick={() =>
              navigate(
                `/invoice-view/${params.row.INVOICE_ID}`
              )
            }
          >
            View / Print
          </Button>

          <Button
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
            onClick={() =>
              navigate(
                `/invoice-entry/${params.row.INVOICE_ID}`
              )
            }
          >
            Edit
          </Button>

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() =>
              handleDelete(
                params.row.INVOICE_ID
              )
            }
          >
            Delete
          </Button>
        </>
      ),
    }
  ];

  const filteredInvoices =
  invoices.filter((invoice) => {

    const search =
      searchText.toLowerCase();

    return (
      invoice.INVOICE_NUMBER
        ?.toLowerCase()
        .includes(search)

      ||

      invoice.CLIENT_NAME
        ?.toLowerCase()
        .includes(search)
    );
  });

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
        <Typography variant="h5">
          Billing
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            navigate("/invoice-entry")
          }
        >
          New Invoice
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search Invoice Number / Client"
        sx={{ mb: 2 }}
        value={searchText}
        onChange={(e) =>
          setSearchText(e.target.value)
        }
      />

      <Paper
        sx={{
          height: 600,
          width: "100%",
        }}
      >
        <DataGrid
          rows={filteredInvoices}
          columns={columns}
          getRowId={(row) =>
            row.INVOICE_ID
          }
        />
      </Paper>
    </Layout>
  );
}
