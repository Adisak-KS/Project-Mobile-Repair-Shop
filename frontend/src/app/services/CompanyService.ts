import api from "../configs/axios";

export const listCompany = async () => {
  try {
    const response = await api.get("/company/list");
    return response.data;
  } catch (error: any) {
    console.error("List Company Error:", error?.response?.data || error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch Company List"
    );
  }
};

export const createCompany = async (
  name: string,
  address: string,
  phone: string,
  email: string,
  taxCode: string
) => {
  try {
    const response = await api.post("/company/create", {
      name,
      address,
      phone,
      email,
      taxCode,
    });
    return response;
  } catch (error: any) {
    console.error("Create Company Error:", error?.response?.data || error);
    throw new Error(
      error?.response?.data?.message || "Failed to create company"
    );
  }
};
