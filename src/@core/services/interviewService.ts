import { API_BASE_URL } from "@/@core/utils/constants"

import axios, { AxiosResponse } from "axios";

interface InterviewData {
  application_id: number;
  user_id: number;
  job_id: number; // Added to match formattedData
  interview_date: string;
  interview_time: string;
  interview_location: string;
  interviewer_department: string;
  interviewer_name: string;
  interviewer_role: string;
  interviewer_email: string;
  interviewer_phone: string;
  tbo_rep_name: string; // Added
  tbo_rep_email: string; // Added
  tbo_rep_phone: string; // Added
  address?: string; // Optional, but may not be needed if interview_location is used
  status: string;
}

export const scheduleInterview = async (data: InterviewData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/interviews/schedule`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error scheduling interview:", error);
    throw error.response?.data || error.message;
  }
};


interface APIResponse {
  clients: InterviewData[];
}
// export const fetchInterviews = async (): Promise<InterviewData[]> => {
//   try {
//     const response: AxiosResponse<APIResponse> = await axios.get(
//       `${API_BASE_URL}/admin/interviews`
//     );
//     console.log(response);
//     console.log(response.data.clients);
//     return response.data.clients; // Return the fetched data
//   } catch (error) {
//     console.error("Error fetching admin data:", error);
//     throw error;
//   }
// };
export const fetchInterviews = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/interviews`);
    return response.data; // Return the full response data (e.g., {status: true, interviews: []})
  } catch (error: any) {
    // Provide more specific error details
    if (error.response) {
      throw new Error(`Failed to fetch interviews: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      throw new Error("Failed to fetch interviews: No response received from server.");
    } else {
      throw new Error(`Failed to fetch interviews: ${error.message}`);
    }
  }
};


export const updateInterviewStatus = async (interviewId: number, status: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/admin/interviews/${interviewId}/update`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update interview status');
  }
};