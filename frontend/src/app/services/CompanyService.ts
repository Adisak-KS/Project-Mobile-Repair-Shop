import api from "../configs/axios";

export const listCompany = async () => {
  const response = await api.get("/company/list");
  return response.data;
};

export const createCompany = async (
  name: string,
  address: string,
  phone: string,
  email: string,
  taxCode: string
) => {
  const response = await api.post("/company/create", {
    name,
    address,
    phone,
    email,
    taxCode,
  });
  return response.data;
};
