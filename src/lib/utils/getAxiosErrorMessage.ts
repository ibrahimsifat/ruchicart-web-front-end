import axios from "axios";

export const getAxiosErrorMessage = (
  error: unknown,
  defaultMessage = "An error occurred"
): string => {
  if (axios.isAxiosError(error)) {
    // Check if response exists and has an 'errors' array
    if (error.response?.data?.errors?.length) {
      return error.response.data.errors[0].message;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};
