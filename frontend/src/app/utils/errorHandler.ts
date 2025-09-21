import { AxiosError } from "axios";

export function extractErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }
  return "Unexpected error occurred";
}
