import api from "../configs/axios";

export const listProduct = async () => {
  try {
    const response = await api.get("/buy/list");
    return response.data;
  } catch (error: any) {
    console.error("List Buy Error :", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Failed to list buy");
  }
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
  remark: string
) => {
  try {
    const response = await api.post("/buy/create", {
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
  } catch (error: any) {
    console.error("Create Buy Error:", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Failed to create buy");
  }
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
  try {
    const response = await api.put(`/buy/update/${id}`, {
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
  } catch (error: any) {
    console.error("Update Buy Error :", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Failed to Update Buy");
  }
};

export const DeleteBuy = async (id: string) => {
  try {
    const response = await api.delete(`/buy/remove/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Delete Buy Error :", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Failed to delete Buy");
  }
};
