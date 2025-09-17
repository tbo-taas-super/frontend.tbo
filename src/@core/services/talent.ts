import { API_BASE_URL } from "@/@core/utils/constants";
import axios, { AxiosResponse } from "axios";
import { getSession } from "next-auth/react";


export interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  receiver_id: number;
  
  message_text: string;
  sent_at: string;
  status: string;
}

export interface Interest {
  id: number;
  job_title: string;
  client_name: string;
  admin_id: number;
  admin_name: string;
  messages: Message[];
}


export const getTalentInterests = async (): Promise<{ interests: Interest[] }> => {
  const session = await getSession();
  const token = session?.user?.accessToken;
  if (!token) throw new Error("Missing token");

  const response: AxiosResponse<{ status: boolean; interests: Interest[] }> = await axios.get(
    `${API_BASE_URL}/talent/requests`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.data.status) {
    throw new Error("Failed to fetch interests");
  }
  return { interests: response.data.interests };
};

export const fetchMessages = async (requestId: number): Promise<{ messages: Message[] }> => {
  const session = await getSession();
  const token = session?.user?.accessToken;
  if (!token) throw new Error("Missing token");

  const response: AxiosResponse<{ status: boolean; messages: Message[] }> = await axios.get(
    `${API_BASE_URL}/talent/requests/${requestId}/messages`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.data.status) {
    throw new Error("Failed to fetch messages");
  }
  return { messages: response.data.messages };
};

interface ApiErrorResponse {
  status: boolean;
  message: string;
  data: Message;
  errors?: {
    receiver_id?: string[];
    message_text?: string[];
  };
}


export const sendMessage = async (requestId: number, receiverId: number, messageText: string): Promise<Message> => {
  const session = await getSession();
  const token = session?.user?.accessToken;
  if (!token) throw new Error("Missing token");

  const response: AxiosResponse<ApiErrorResponse> = await axios.post(
  `${API_BASE_URL}/talent/requests/${requestId}/send-message`,
  { receiver_id: receiverId, message_text: messageText },
  { headers: { Authorization: `Bearer ${token}` } }
);

  if (!response.data.status) {
    throw new Error(
      response.data.message ||
      response.data.errors?.receiver_id?.[0] ||
      response.data.errors?.message_text?.[0] ||
      "Failed to send message"
    );
  }
  return response.data.data;
};