import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const SignIn = async (username: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
    username,
    password,
  });
  return response.data;
};

export const SignUp = async (
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  confirmPassword: string
) => {
  const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
    firstName,
    lastName,
    username,
    password,
    confirmPassword,
  });
  return response.data;
};
