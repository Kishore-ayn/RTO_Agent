import { useEffect, useState } from "react";

import {
  Typography,
  Paper,
  TextField,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";

import Layout from "../components/Layout";

import {
  getVehicles,
} from "../services/vehicleService";

export default function VehicleList() {
  const [vehicles, setVehicles] =
    useState([]);
  
  const [searchText, setSearchText] =
  useState("");  

  const navigate = useNavigate();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data =
        await getVehicles();

      setVehicles(data);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      field: "VEHICLE_ID",
      headerName: "ID",
      width: 80,
    },
    {
      field: "VEHICLE_NUMBER",
      headerName:
        "Vehicle Number",
      width: 180,
    },
    {
      field: "OWNER_NAME",
      headerName:
        "Owner Name",
      width: 180,
    },
    {
      field: "OWNER_CONTACT",
      headerName:
        "Contact",
      width: 150,
    },
    {
      field: "OWNER_WHATSAPP",
      headerName:
        "Whatsapp",
      width: 150,
    },
    {
      field: "VEHICLE_TYPE",
      headerName:
        "Vehicle Type",
      width: 150,
    },
    {
    field: "actions",
    headerName: "Actions",
    width: 150,

    renderCell: (params) => (
      <Button
        variant="contained"
        size="small"
        onClick={() =>
          navigate(
            `/vehicle-entry/${params.row.VEHICLE_ID}`
          )
        }
      >
        Edit
      </Button>
    ),
}
  ];

  const filteredVehicles =
  vehicles.filter((vehicle) => {

    const search =
      searchText.toLowerCase();

    return (
      vehicle.VEHICLE_NUMBER
        ?.toLowerCase()
        .includes(search)

      ||

      vehicle.OWNER_NAME
        ?.toLowerCase()
        .includes(search)

      ||

      vehicle.OWNER_CONTACT
        ?.toString()
        .includes(search)

      ||

      vehicle.OWNER_WHATSAPP
        ?.toString()
        .includes(search)
    );
  });

  return (
    <Layout>
      <Typography
        variant="h5"
        gutterBottom
      >
        Vehicle List
      </Typography>


      <TextField
        fullWidth
        label="Search Vehicle / Owner / Contact"
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
          rows={filteredVehicles}
          columns={columns}
          getRowId={(row) =>
            row.VEHICLE_ID
          }
        />
      </Paper>
    </Layout>
  );
}