import api from "../configs/axios";

export const listProduct = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/buy/list?page=${page}&limit=${limit}`);
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
};

export const DeleteBuy = async (id: string) => {
  const response = await api.delete(`/buy/remove/${id}`);
  return response.data;
};

export const exportToExcelSell = async (page?: number)=>{
  const url = page ? `/buy/export?page=${page}` : `/buy/export`;
  const response = await api.get(url, {
    responseType: 'blob',
  });
  return response;
}
