import api from "../configs/axios";

export const listUser = async () => {
  const response = await api.get("/user/list");
  return response.data;
};

export const userInfo = async () => {
  const response = await api.get("/user/info");
  return response.data;
};

export const createUser = async (
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  confirmPassword: string,
  level: string
) => {
  const response = await api.post("/user/create", {
    firstName,
    lastName,
    username,
    password,
    confirmPassword,
    level,
  });

  return response.data;
};

export const updateUser = async (
  id: string,
  firstName: string,
  lastName: string,
  username: string,
  level: string
) => {
  const response = await api.put(`/user/update/${id}`, {
    firstName,
    lastName,
    username,
    level,
  });

  return response.data;
};

export const removeUser = async (id: string) => {
  const response = await api.delete(`/user/remove/${id}`);
  return response.data;
};

export const updateUserInfo = async (
  firstName: string,
  lastName: string,
  password: string,
  level: string
) => {
  const response = await api.put("/user/update", {
    firstName,
    lastName,
    password,
    level,
  });
  return response.data;
};
