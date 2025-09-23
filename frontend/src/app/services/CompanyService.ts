import axios from "axios";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const listCompany = async () => {
  const response = await axios.get(`${API_BASE_URL}/company/list`);
  return response.data;
};

export const createCompany = async (
  name: string,
  address: string,
  phone: string,
  email: string,
  taxCode: string
) => {
  const response = await axios.post(`${API_BASE_URL}/company/create`, {
    name,
    address,
    phone,
    email,
    taxCode,
  });
  return response.data;
};
