import axios, { AxiosRequestHeaders } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const userInfo = async (headers: Record<string, string>) => {
  const response = await axios.get(`${API_BASE_URL}/user/info`, { headers });
  return response.data;
};

export const updateUser = async (
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
