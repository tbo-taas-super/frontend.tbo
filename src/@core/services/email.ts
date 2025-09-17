import { toast } from "react-hot-toast";
import { API_BASE_URL } from "@/@core/utils/constants";
import axios, { AxiosError } from "axios";

interface SupportRequestData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ApiResponse {
  message?: string;
  success: boolean;
  data?: any;
}

export const submitSupportRequest = async (data: SupportRequestData): Promise<boolean> => {
  try {
    const response = await axios.post<ApiResponse>(
      `${API_BASE_URL}/support-request`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        }
      }
    );

    if (response.data.success) {
      toast.success(response.data.message || "Message sent successfully!");
      return true;
    }

    throw new Error(response.data.message || "Request failed without error");
  } catch (error) {
    let errorMessage = "Failed to send message. Please try again.";

    if (error instanceof AxiosError) {
      // Handle 500 server errors
      if (error.response?.status === 500) {
        errorMessage = "Server error occurred. Please contact support.";
      } else {
        errorMessage = error.response?.data?.message || 
                      error.response?.data?.error ||
                      error.message;
      }
    }

    toast.error(errorMessage);
    console.error("API Error:", error);
    return false;
  }
};