import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Print, ArrowBack } from "@mui/icons-material";

import { getInvoiceById } from "../services/invoiceService";
import { amountToWords } from "../utils/numberToWords";

const COMPANY_NAME = "PRAKASH RTA CONSULTANCY";
const COMPANY_ADDRESS = [
  "Chinagantyada Bus Stop, NH-5,",
  "Gajuwaka, Visakhapatnam",
];

export default function InvoiceView() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  useEffect(() => {
    if (!invoice) {
      return;
    }

    const previousTitle = document.title;
    document.title = invoice.INVOICE_NUMBER;

    return () => {
      document.title = previousTitle;
    };
  }, [invoice]);

  const loadInvoice = async () => {
    try {
      const data = await getInvoiceById(id);
      setInvoice(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!invoice) {
    return null;
  }

  const total = Number(invoice.TOTAL_AMOUNT) || 0;

  return (
    <Box
      sx={{
        backgroundColor: "#F1F5F9",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: 850,
          mx: "auto",
          mb: 2,
          px: 2,
          display: "flex",
          justifyContent: "space-between",
          "@media print": { display: "none" },
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/invoice-list")}
        >
          Back to Billing
        </Button>

        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={() => window.print()}
        >
          Print
        </Button>
      </Box>

      <Paper
        elevation={4}
        sx={{
          maxWidth: 850,
          mx: "auto",
          p: 5,
          borderRadius: 2,
          "@media print": {
            boxShadow: "none",
            borderRadius: 0,
            m: 0,
            maxWidth: "100%",
          },
        }}
      >
        <Typography
          variant="h5"
          align="center"
          fontWeight={800}
          sx={{ mb: 3, letterSpacing: 2 }}
        >
          BILL
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              From:
            </Typography>

            <Typography variant="h6" fontWeight={800}>
              {COMPANY_NAME}
            </Typography>

            {COMPANY_ADDRESS.map((line) => (
              <Typography key={line} variant="body2" color="text.secondary">
                {line}
              </Typography>
            ))}
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Date: {invoice.INVOICE_DATE?.substring(0, 10)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            To,
          </Typography>

          <Typography variant="subtitle1" fontWeight={700}>
            {invoice.CLIENT_NAME}
          </Typography>

          {invoice.CLIENT_ADDRESS && (
            <Typography variant="body2" color="text.secondary">
              {invoice.CLIENT_ADDRESS}
            </Typography>
          )}
        </Box>

        <TableContainer sx={{ mb: 2, border: "1px solid #E2E8F0" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Particulars</strong></TableCell>
                <TableCell align="right"><strong>Quantity</strong></TableCell>
                <TableCell align="right"><strong>Rate</strong></TableCell>
                <TableCell align="right"><strong>Amount</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell colSpan={4}>
                  Service charges for obtaining RTO approvals like
                </TableCell>
              </TableRow>

              {invoice.ITEMS.map((item) => (
                <TableRow key={item.ITEM_ID}>
                  <TableCell>{item.PARTICULARS}</TableCell>
                  <TableCell align="right">
                    {item.QUANTITY ?? ""}
                  </TableCell>
                  <TableCell align="right">
                    {item.RATE ?? ""}
                  </TableCell>
                  <TableCell align="right">
                    {Number(item.AMOUNT).toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={3} align="right">
                  <strong>Total</strong>
                </TableCell>
                <TableCell align="right">
                  {total.toLocaleString("en-IN")}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={3} align="right">
                  ADD: GST@ (unregistered)
                </TableCell>
                <TableCell align="right">NA</TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={3} align="right">
                  <strong>Total</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{total.toLocaleString("en-IN")}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography sx={{ mb: 5 }}>
          Rupees: {amountToWords(total)} rupees only
        </Typography>

        <Box sx={{ textAlign: "right" }}>
          <Typography variant="body2">Thank you,</Typography>

          <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 1 }}>
            {COMPANY_NAME}
          </Typography>

          {COMPANY_ADDRESS.map((line) => (
            <Typography key={line} variant="body2" color="text.secondary">
              {line}
            </Typography>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
