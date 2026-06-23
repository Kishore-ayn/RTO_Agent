import api from "../api/api";

export const getVehicles = async () => {
  const response = await api.get("/vehicles");
  return response.data;
};

export const createVehicle = async (data) => {
  const response = await api.post("/vehicles", data);
  return response.data;
};

export const updateVehicle = async (
  vehicleId,
  data
) => {
  const response = await api.put(
    `/vehicles/${vehicleId}`,
    data
  );

  return response.data;
};

export const deleteVehicle = async (
  vehicleId
) => {
  const response = await api.delete(
    `/vehicles/${vehicleId}`
  );

  return response.data;
};

export const getVehicleById = async (
  vehicleId
) => {
  const response = await api.get(
    `/vehicles/${vehicleId}`
  );

  return response.data;
};