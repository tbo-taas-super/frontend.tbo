import { API_BASE_URL } from "@/@core/utils/constants";
import axios, { AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

// Interface for Talent Pool Data
export interface TalentPoolData {
  status: boolean;
  stats: {
    total_talent: number;
    active_talent: number;
    inactive_talent: number;
    avg_year_exp: string;
  };
  talents: {
    id: number;
    name: string;
    designation: string | null;
    location: string | null;
    years_experience: number | null;
    status: string;
  }[];
}

// Interface for Individual Talent Data
export interface TalentDetailsData {
  status: boolean;
  talent: {
    id: number;
    name: string;
    designation: string | null;
    location: string | null;
    years_experience: number | null;
    status: string;
    professional_summary: string | null;
    skills: string[] | null;
    current_company: string | null;
    education: string | null;
    profile_image: string | null;
    contact_email?: string;
    contact_phone?: string;
    resume_url?: string;
    contact_information?: string;
    resume_url_info?: string;
  };
}

// Interface for Express Interest Response
export interface ExpressInterestData {
  status: boolean;
  message: string;
  request?: {
    id: number;
    client_id: number;
    talent_id: number;
    interested: boolean;
    job_title: string | null;
    request_type: string | null;
    notes: string | null;
    request_date: string | null;
    status: string;
  };
}

// Interface for Client Interest Data
export interface ClientRequestData {
  status: boolean;
  interests: {
    id: number;
    talent: {
      id: number;
      name: string;
      designation: string | null;
      location: string | null;
      years_experience: number | null;
      status: string;
      profile_image: string | null;
    };
    job_title: string;
    request_type: string;
    notes: string | null;
    status: string;
    request_date: string;
    messages?: Message[];
  }[];
}

// Interface for Message Data
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

export const getTalentPool = async (): Promise<TalentPoolData> => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (!token) throw new Error("Missing token");

  const response: AxiosResponse<TalentPoolData> = await axios.get(
    `${API_BASE_URL}/client/talents`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const getTalentById = async (id: number): Promise<TalentDetailsData> => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (!token) throw new Error("Missing token");

  const response: AxiosResponse<TalentDetailsData> = await axios.get(
    `${API_BASE_URL}/client/talents/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const expressInterest = async (
  id: number,
  data: {
    interested: boolean;
    interest_type: "new_job" | "general" | "existing_job";
    job_id?: number;
    job_title?: string;
    request_type?: "Direct Hire" | "Contract" | "Other";
    notes?: string;
  }
): Promise<ExpressInterestData> => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (!token) throw new Error("Missing token");

  const response: AxiosResponse<ExpressInterestData> = await axios.post(
    `${API_BASE_URL}/client/talents/${id}/interest`,
    {
      ...data,
      job_id: data.interest_type === "existing_job" ? data.job_id : undefined,
      job_title:
        data.interest_type === "new_job" ? data.job_title : undefined,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const getClientInterests = async (): Promise<ClientRequestData> => {
  const session = await getSession();
  const token = session?.user?.accessToken;
  if (!token) throw new Error("Missing token");

  const response: AxiosResponse<ClientRequestData> = await axios.get(
    `${API_BASE_URL}/client/interests`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const fetchMessages = async (requestId: number): Promise<{ messages: Message[] }> => {
  const session = await getSession();
  const token = session?.user?.accessToken;
  if (!token) throw new Error("Missing token");

  const response: AxiosResponse<{ messages: Message[] }> = await axios.get(
    `${API_BASE_URL}/client/requests/${requestId}/messages`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const sendMessage = async (
  requestId: number,
  receiverId: number,
  message: string
): Promise<Message> => {
  const session = await getSession();
  const token = session?.user?.accessToken;
  if (!token) throw new Error("Missing token");

  const response: AxiosResponse<Message> = await axios.post(
    `${API_BASE_URL}/client/talents/${requestId}/send-message`,
    {
      receiver_id: receiverId,
      message_text: message,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};