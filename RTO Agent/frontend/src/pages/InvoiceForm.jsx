import { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import Layout from "../components/Layout";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  createInvoice,
  updateInvoice,
  getInvoiceById,
} from "../services/invoiceService";

const emptyItem = {
  PARTICULARS: "",
  QUANTITY: "",
  RATE: "",
  AMOUNT: "",
};

export default function InvoiceForm() {

  const { id } = useParams();

  const navigate = useNavigate();

  const isEditMode = !!id;

  const [formData, setFormData] =
    useState({
      CLIENT_NAME: "",
      CLIENT_ADDRESS: "",
      INVOICE_DATE:
        new Date().toISOString().substring(0, 10),
  });

  const [items, setItems] =
    useState([{ ...emptyItem }]);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadInvoice();
    }
  }, [id]);

  const loadInvoice = async () => {
    try {
      const data =
        await getInvoiceById(id);

      setFormData({
        CLIENT_NAME:
          data.CLIENT_NAME || "",

        CLIENT_ADDRESS:
          data.CLIENT_ADDRESS || "",

        INVOICE_DATE:
          data.INVOICE_DATE
            ? data.INVOICE_DATE.substring(0, 10)
            : "",
      });

      setItems(
        data.ITEMS && data.ITEMS.length > 0
          ? data.ITEMS.map((item) => ({
              PARTICULARS: item.PARTICULARS || "",
              QUANTITY:
                item.QUANTITY ?? "",
              RATE:
                item.RATE ?? "",
              AMOUNT:
                item.AMOUNT ?? "",
            }))
          : [{ ...emptyItem }]
      );
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

  const handleItemChange = (
    index,
    field,
    value
  ) => {
    const updated = [...items];

    const updatedItem = {
      ...updated[index],
      [field]: value,
    };

    if (field === "QUANTITY" || field === "RATE") {
      // An empty Quantity or Rate counts as 0 here (not blank) so the
      // computed Amount is always a real number — otherwise a blank Amount
      // makes the row look "incomplete" and it gets silently dropped from
      // the invoice by the validItems filter on save.
      updatedItem.AMOUNT =
        (Number(updatedItem.QUANTITY) || 0) *
        (Number(updatedItem.RATE) || 0);
    }

    updated[index] = updatedItem;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { ...emptyItem }]);
  };

  const removeItemRow = (index) => {
    setItems(
      items.filter((_, i) => i !== index)
    );
  };

  const totalAmount = items.reduce(
    (sum, item) =>
      sum + (Number(item.AMOUNT) || 0),
    0
  );

  const handleSubmit = async () => {

    if (isSaving) {
      return;
    }

    if (!formData.CLIENT_NAME) {
      alert("Please enter the client name");
      return;
    }

    const validItems = items.filter(
      (item) =>
        item.PARTICULARS && item.AMOUNT !== ""
    );

    if (validItems.length === 0) {
      alert(
        "Please add at least one line item with particulars and amount"
      );
      return;
    }

    setIsSaving(true);

    try {

      const payload = {
        CLIENT_NAME: formData.CLIENT_NAME,
        CLIENT_ADDRESS: formData.CLIENT_ADDRESS,
        INVOICE_DATE: formData.INVOICE_DATE,
        ITEMS: validItems.map((item) => ({
          PARTICULARS: item.PARTICULARS,
          QUANTITY:
            item.QUANTITY === ""
              ? null
              : Number(item.QUANTITY),
          RATE:
            item.RATE === ""
              ? null
              : Number(item.RATE),
          AMOUNT: Number(item.AMOUNT),
        })),
      };

      if (isEditMode) {

        await updateInvoice(id, payload);

        alert("Invoice Updated Successfully");

      } else {

        await createInvoice(payload);

        alert("Invoice Created Successfully");
      }

      navigate("/invoice-list");

    } catch (error) {

      console.error(error);

      alert("Error Saving Invoice");

    } finally {

      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>

        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
        >
          {isEditMode ? "Edit Invoice" : "New Invoice"}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Create or update a billing invoice
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Client Name"
              name="CLIENT_NAME"
              value={formData.CLIENT_NAME}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Invoice Date"
              name="INVOICE_DATE"
              value={formData.INVOICE_DATE}
              onChange={handleChange}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Client Address"
              name="CLIENT_ADDRESS"
              value={formData.CLIENT_ADDRESS}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ mb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Line Items
          </Typography>
          <Divider sx={{ mt: 1, mb: 2 }} />
        </Box>

        {items.map((item, index) => (
          <Grid
            container
            spacing={2}
            key={index}
            sx={{ mb: 1 }}
            alignItems="center"
          >
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Particulars"
                value={item.PARTICULARS}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "PARTICULARS",
                    e.target.value
                  )
                }
              />
            </Grid>

            <Grid item xs={4} md={2}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={item.QUANTITY}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "QUANTITY",
                    e.target.value
                  )
                }
              />
            </Grid>

            <Grid item xs={4} md={2}>
              <TextField
                fullWidth
                type="number"
                label="Rate"
                value={item.RATE}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "RATE",
                    e.target.value
                  )
                }
              />
            </Grid>

            <Grid item xs={3} md={2}>
              <TextField
                fullWidth
                type="number"
                label="Amount"
                value={item.AMOUNT}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            </Grid>

            <Grid item xs={1}>
              <IconButton
                color="error"
                disabled={items.length === 1}
                onClick={() => removeItemRow(index)}
              >
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button
          startIcon={<Add />}
          onClick={addItemRow}
          sx={{ mt: 1, mb: 3 }}
        >
          Add Line Item
        </Button>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          Total: {"₹"}{totalAmount.toLocaleString("en-IN")}
        </Typography>

        <Button
          variant="contained"
          size="large"
          type="submit"
          disabled={isSaving}
          sx={{
            px: 4,
            borderRadius: 3,
          }}
          onClick={handleSubmit}
        >
          {isSaving ? "Saving..." : "Save Invoice"}
        </Button>
      </Paper>
    </Layout>
  );
}
