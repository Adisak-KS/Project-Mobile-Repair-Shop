import axios from "axios";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const listSell = async () => {
  const response = await axios.get(`${API_BASE_URL}/sell/list`);
  return response.data;
};

export const createSell = async (serial: string, price: number) => {
  const response = await axios.post(`${API_BASE_URL}/sell/create`, {
    serial,
    price,
  });

  return response.data;
};

export const removeSell = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/sell/remove/${id}`);
  return response.data;
};

export const confirmSell = async () => {
  const response = await axios.get(`${API_BASE_URL}/sell/confirm`);
  return response.data;
};

export const dashboardSell = async (currentYear: number) => {
  const response = await axios.get(`${API_BASE_URL}/sell/dashboard/${currentYear}`);
  return response.data;
};

export const historySell = async () => {
  const response = await axios.get(`${API_BASE_URL}/sell/history`);
  return response.data;
};

export const infoSell = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/sell/info/${id}`);
  return response.data;
};
