import axios from "axios";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const listService = async () => {
  const response = await axios.get(`${API_BASE_URL}/service/list`);
  return response.data;
};

export const createService = async (
  name: string,
  price: number,
  remark: string
) => {
  const response = await axios.post(`${API_BASE_URL}/service/create`, {
    name,
    price,
    remark,
  });

  return response.data;
};

export const updateService = async (
  id: string,
  name: string,
  price: number,
  remark: string
) => {
  const response = await axios.put(`${API_BASE_URL}/service/update/${id}`, {
    name,
    price,
    remark,
  });
  return response.data;
};

export const removeService = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/service/remove/${id}`);
  return response.data;
};
