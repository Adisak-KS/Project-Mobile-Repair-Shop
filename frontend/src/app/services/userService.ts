import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const listUser = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/list`);
  return response.data;
};

export const userInfo = async (headers: Record<string, string>) => {
  const response = await axios.get(`${API_BASE_URL}/user/info`, { headers });
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
  const response = await axios.post(`${API_BASE_URL}/user/create`, {
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: password,
    confirmPassword: confirmPassword,
    level: level,
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
  const response = await axios.put(`${API_BASE_URL}/user/update/${id}`, {
    firstName: firstName,
    lastName: lastName,
    username: username,
    level: level,
  });

  return response.data;
};

export const removeUser = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/user/remove/${id}`);
  return response.data;
};

export const updateUserInfo = async (
  firstName: string,
  lastName: string,
  password: string,
  level: string,
  authHeader: Record<string, string>
) => {
  const response = await axios.put(
    `${API_BASE_URL}/user/update`,
    {
      firstName: firstName,
      lastName: lastName,
      password: password,
      level: level,
    },
    {
      headers: authHeader,
    }
  );
  return response.data;
};
