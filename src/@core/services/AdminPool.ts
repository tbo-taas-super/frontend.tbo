import { API_BASE_URL } from "@/@core/utils/constants";
import axios, { AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

// Interface for Message
export interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  receiver_id: number;
  message_text: string;
  attachment_url?: string | null;
  sent_at: string;
  status: string;
}

// Interface for Fetch Messages Response
export interface FetchMessagesData {
  status: boolean;
  messages: Message[];
}

// Interface for Admin Requests Data
export interface AdminRequestsData {
  status: boolean;
  stats: {
    total_requests: number;
    processing: number;
    hired: number;
    cancelled: number;
  };
  requests: {
    id: number;
    client: {
      id: number;
      name: string;
      company_logo?: string | null;
      company_email_address?: string | null;
      company_phone?: string | null;
      company_name?: string | null;
    } | null;
    talent: {
      id: number;
      name: string;
      email: string;
      phone_number: string | null;
      account_type: string;
      designation: string | null;
      profile_image: string | null;
      cv_upload: string | null;
      cover_letter_upload: string | null;
      id_upload: string | null;
      video_url: string | null;
      project_screenshots: string[] | null;
      work_sample_upload: string | null;
      portfolio_link: string | null;
      location: string | null;
      years_experience: number | null;
      availability_status: string | null;
      professional_summary: string | null;
      skills: string[] | null;
      current_company: string | null;
      education: string | null;
      created_at: string | null;
    } | null;
    job_title: string;
    request_date: string | null;
    status: string;
    messages?: Message[];
  }[];
}

// Interface for Individual Request Details
export interface AdminRequestDetailsData {
  status: boolean;
  request: {
    id: number;
    company_name: string;
    company_email: string;
    company_phone: string;
    talent_name: string;
    talent_email: string;
    talent_phone: string;
    job_title: string;
    request_type: string | null;
    notes: string | null;
    request_date: string | null;
    status: string;
    messages?: Message[];
  };
}

// Interface for Update Status Response
export interface UpdateStatusData {
  status: boolean;
  message: string;
  request: {
    id: number;
    client_id: number;
    talent_id: number;
    job_title: string | null;
    request_date: string | null;
    status: string;
  };
}

// Interface for Send Message Response
export interface SendMessageData {
  id: number;
  status: boolean;
  message: string;
  data: Message;
}

export const fetchMessages = async (id: number): Promise<FetchMessagesData> => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (!token) throw new Error("Missing authentication");

  const endpoint = `${API_BASE_URL}/admin/requests/${id}/messages`;

  const response: AxiosResponse<FetchMessagesData> = await axios.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const getAdminRequests = async (): Promise<AdminRequestsData> => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (!token) throw new Error("Missing token");

  const response: AxiosResponse<AdminRequestsData> = await axios.get(
    `${API_BASE_URL}/admin/requests`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const getAdminRequestById = async (
  id: number
): Promise<AdminRequestDetailsData> => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (!token) throw new Error("Missing token");

  const response: AxiosResponse<AdminRequestDetailsData> = await axios.get(
    `${API_BASE_URL}/admin/requests/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const updateRequestStatus = async (
  id: number,
  status: "Processing" | "Hired" | "Cancelled"
): Promise<UpdateStatusData> => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (!token) throw new Error("Missing token");

  const response: AxiosResponse<UpdateStatusData> = await axios.put(
    `${API_BASE_URL}/admin/requests/${id}/status`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const sendMessage = async (
  id: number,
  receiverId: number,
  messageText: string,
  attachmentUrl?: string | null,
  sendEmail?: boolean
): Promise<SendMessageData> => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (!token) throw new Error("Missing token");

  const response: AxiosResponse<SendMessageData> = await axios.post(
    `${API_BASE_URL}/admin/requests/${id}/send-message`,
    {
      receiver_id: receiverId,
      message_text: messageText,
      attachment_url: attachmentUrl,
      send_email: sendEmail,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};