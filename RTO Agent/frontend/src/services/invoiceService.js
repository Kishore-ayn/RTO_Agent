import api from "../api/api";

export const getInvoices = async () => {
  const response = await api.get("/invoices");
  return response.data;
};

export const createInvoice = async (data) => {
  const response = await api.post("/invoices", data);
  return response.data;
};

export const updateInvoice = async (
  invoiceId,
  data
) => {
  const response = await api.put(
    `/invoices/${invoiceId}`,
    data
  );

  return response.data;
};

export const deleteInvoice = async (
  invoiceId
) => {
  const response = await api.delete(
    `/invoices/${invoiceId}`
  );

  return response.data;
};

export const getInvoiceById = async (
  invoiceId
) => {
  const response = await api.get(
    `/invoices/${invoiceId}`
  );

  return response.data;
};
