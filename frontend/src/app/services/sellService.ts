import axios from "axios";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const createSell = async (serial: string, price: number) => {
  const response = await axios.post(`${API_BASE_URL}/sell/create`, {
    serial,
    price,
  });

  return response.data;
};
