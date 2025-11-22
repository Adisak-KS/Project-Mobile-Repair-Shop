import api from "../configs/axios";

export const listService = async () => {
  const response = await api.get("/service/list");
  return response.data;
};

export const createService = async (
  name: string,
  price: number,
  remark: string
) => {
  const response = await api.post("/service/create", {
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
  const response = await api.put(`/service/update/${id}`, {
    name,
    price,
    remark,
  });
  return response.data;
};

export const removeService = async (id: number) => {
  const response = await api.delete(`/service/remove/${id}`);
  return response.data;
};
