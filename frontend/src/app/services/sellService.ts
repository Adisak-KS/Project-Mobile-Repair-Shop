import api from "../configs/axios";

export const listSell = async () => {
  const response = await api.get("/sell/list");
  return response.data;
};

export const createSell = async (serial: string, price: number) => {
  const response = await api.post("/sell/create", {
    serial,
    price,
  });

  return response.data;
};

export const removeSell = async (id: number) => {
  const response = await api.delete(`/sell/remove/${id}`);
  return response.data;
};

export const confirmSell = async () => {
  const response = await api.get("/sell/confirm");
  return response.data;
};

export const dashboardSell = async (currentYear: number) => {
  const response = await api.get(`/sell/dashboard/${currentYear}`);
  return response.data;
};

export const historySell = async () => {
  const response = await api.get("/sell/history");
  return response.data;
};

export const infoSell = async (id: string) => {
  const response = await api.get(`/sell/info/${id}`);
  return response.data;
};
