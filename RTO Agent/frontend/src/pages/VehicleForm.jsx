import { useState } from "react";

import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import Layout from "../components/Layout";

import { useEffect } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  createVehicle,
  updateVehicle,
  getVehicleById,
} from "../services/vehicleService";

export default function VehicleForm() {

  const { id } = useParams();

  const navigate = useNavigate();

  const isEditMode = !!id;    

  const [formData, setFormData] =
    useState({
      VEHICLE_NUMBER: "",
      CHASSIS_NUMBER: "",

      OWNER_NAME: "",
      OWNER_CONTACT: "",
      OWNER_WHATSAPP: "",

      VEHICLE_TYPE: "",
      ENGINE_NUMBER: "",

      FC_EXPIRY_DATE: "",
      NP_EXPIRY_DATE: "",
      PERMIT_EXPIRY_DATE: "",
      INSURANCE_EXPIRY: "",

      ADDRESS: "",
      REMARKS: "",
  });

useEffect(() => {
  if (id) {
    loadVehicle();
  }
}, [id]);

const loadVehicle = async () => {
  try {
    const data =
      await getVehicleById(id);

    setFormData({
      VEHICLE_NUMBER:
        data.VEHICLE_NUMBER || "",

      CHASSIS_NUMBER:
        data.CHASSIS_NUMBER || "",

      OWNER_NAME:
        data.OWNER_NAME || "",

      OWNER_CONTACT:
        data.OWNER_CONTACT || "",

      OWNER_WHATSAPP:
        data.OWNER_WHATSAPP || "",

      VEHICLE_TYPE:
        data.VEHICLE_TYPE || "",

      ENGINE_NUMBER:
        data.ENGINE_NUMBER || "",

      FC_EXPIRY_DATE:
        data.FC_EXPIRY_DATE
          ? data.FC_EXPIRY_DATE.substring(0, 10)
          : "",

      NP_EXPIRY_DATE:
        data.NP_EXPIRY_DATE
          ? data.NP_EXPIRY_DATE.substring(0, 10)
          : "",

      PERMIT_EXPIRY_DATE:
        data.PERMIT_EXPIRY_DATE
          ? data.PERMIT_EXPIRY_DATE.substring(0, 10)
          : "",

      INSURANCE_EXPIRY:
        data.INSURANCE_EXPIRY
          ? data.INSURANCE_EXPIRY.substring(0, 10)
          : "",

      ADDRESS:
        data.ADDRESS || "",

      REMARKS:
        data.REMARKS || "",
    });
  } catch (error) {
    console.error(error);
  }
  };  


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async () => {
  try {

    if (isEditMode) {

      await updateVehicle(
        id,
        formData
      );

      alert(
        "Vehicle Updated Successfully"
      );

    } else {

      await createVehicle(
        formData
      );

      alert(
        "Vehicle Saved Successfully"
      );
    }

    navigate("/vehicle-list");

  } catch (error) {

    console.error(error);

    alert(
      "Error Saving Vehicle"
    );
  }
};

  return (
    <Layout>
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
        >
        {
          isEditMode
          ? "Edit Vehicle"
          : "Vehicle Entry"
        }
        </Typography>

        <Grid
          container
          spacing={2}
        >
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vehicle Number"
              name="VEHICLE_NUMBER"
              value={
                formData.VEHICLE_NUMBER
              }
              onChange={
                handleChange
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Chassis Number"
              name="CHASSIS_NUMBER"
              value={
                formData.CHASSIS_NUMBER
              }
              onChange={
                handleChange
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Owner Name"
              name="OWNER_NAME"
              value={
                formData.OWNER_NAME
              }
              onChange={
                handleChange
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Owner Contact"
              name="OWNER_CONTACT"
              value={
                formData.OWNER_CONTACT
              }
              onChange={
                handleChange
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Whatsapp Number"
              name="OWNER_WHATSAPP"
              value={
                formData.OWNER_WHATSAPP
              }
              onChange={
                handleChange
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vehicle Type"
              name="VEHICLE_TYPE"
              value={
                formData.VEHICLE_TYPE
              }
              onChange={
                handleChange
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Engine Number"
              name="ENGINE_NUMBER"
              value={
                formData.ENGINE_NUMBER
              }
              onChange={
                handleChange
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="FC Expiry Date"
              name="FC_EXPIRY_DATE"
              value={formData.FC_EXPIRY_DATE}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="NP Expiry Date"
              name="NP_EXPIRY_DATE"
              value={formData.NP_EXPIRY_DATE}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Permit Expiry Date"
              name="PERMIT_EXPIRY_DATE"
              value={formData.PERMIT_EXPIRY_DATE}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Insurance Expiry"
              name="INSURANCE_EXPIRY"
              value={formData.INSURANCE_EXPIRY}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="ADDRESS"
              value={
                formData.ADDRESS
              }
              onChange={
                handleChange
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Remarks"
              name="REMARKS"
              value={
                formData.REMARKS
              }
              onChange={
                handleChange
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={
                handleSubmit
              }
            >
              Save Vehicle
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
}