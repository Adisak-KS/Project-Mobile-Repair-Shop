import axios from "axios";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const listProduct = async () => {
  const response = await axios.get(`${API_BASE_URL}/buy/list`);
  return response.data;
};

export const createBuy = async (
  serial: string,
  name: string,
  release: string,
  color: string,
  price: number,
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  remark: string,
  qty: number,
) => {
  const response = await axios.post(`${API_BASE_URL}/buy/create`, {
    serial,
    name,
    release,
    color,
    price,
    customerName,
    customerPhone,
    customerAddress,
    remark,
    qty,
  });

  return response.data;
};

export const updateBuy = async (
  id: string,
  serial: string,
  name: string,
  release: string,
  color: string,
  price: number,
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  remark: string
) => {
  const response = await axios.put(`${API_BASE_URL}/buy/update/${id}`, {
    serial,
    name,
    release,
    color,
    price,
    customerName,
    customerPhone,
    customerAddress,
    remark,
  });
  return response.data;
};

export const DeleteBuy = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/buy/remove/${id}`);
  return response.data;
};
