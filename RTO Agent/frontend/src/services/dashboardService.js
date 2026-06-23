import api from "../api/api";

export const getDashboardStats = async () => {
  const response = await api.get(
    "/dashboard/stats"
  );

  return response.data;
};

export const getFcDueVehicles =
  async () => {
    const response =
      await api.get(
        "/dashboard/fc-due"
      );

    return response.data;
  };

export const getPermitDueVehicles =
  async () => {
    const response =
      await api.get(
        "/dashboard/permit-due"
      );

    return response.data;
  };

export const getInsuranceDueVehicles =
  async () => {
    const response =
      await api.get(
        "/dashboard/insurance-due"
      );

    return response.data;
  };