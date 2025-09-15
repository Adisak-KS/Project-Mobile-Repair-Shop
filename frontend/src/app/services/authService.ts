import api from "../configs/axios";

export const SignIn = async (username: string, password: string) => {
  const response = await api.post("/auth/signin", {
    username,
    password,
  });
  return response;
};

export const SignUp = async (
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  confirmPassword: string
) => {
  const response = await api.post("/auth/signup", {
    firstName,
    lastName,
    username,
    password,
    confirmPassword,
  });
  return response;
};
