import axios from "axios";
import { getSession } from "next-auth/react";
import { API_BASE_URL } from "@/@core/utils/constants";
import {
  AppliedJob,
  JobsApiResponse,
} from "./types/job"; // Adjust path based on your structure

interface SavedJob {
  id: number;
  job_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  job: Job;
}

interface SavedJobsApiResponse {
  status: boolean;
  savedJobs: SavedJob[];
}


export const getJobs = async (): Promise<Job[]> => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;
    const response = await axios.get<JobsApiResponse>(`${API_BASE_URL}/talent/jobs`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.jobs;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data);
    } else {
      console.error("Unexpected Error:", error);
    }
    throw error;
  }
};

export const getSavedJobs = async (): Promise<SavedJob[]> => {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Not authenticated");

    const token = session.user.accessToken;
    const response = await axios.get<SavedJobsApiResponse>(`${API_BASE_URL}/talent/saved-jobs`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.data.status || !response.data.savedJobs) {
      throw new Error("Invalid saved jobs response");
    }

    return response.data.savedJobs; // 👈 RETURN THE ARRAY ONLY
  } catch (error) {
    console.error("getSavedJobs error:", error);
    throw new Error("Failed to fetch saved jobs");
  }
};

export const saveJob = async (jobId: number): Promise<void> => {
  try {
    const session = await getSession();
    const token = session?.user?.accessToken;

    if (!token) throw new Error("Missing token");

    await axios.post(
      `${API_BASE_URL}/jobs/${jobId}/save`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error (saveJob):", error.response?.data);
    } else {
      console.error("Unexpected Error (saveJob):", error);
    }
    throw error;
  }
};

export const applyJob = async (jobId: number): Promise<void> => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;

    await axios.post(
      `${API_BASE_URL}/jobs/${jobId}/apply`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error (applyJob):", error.response?.data);
    } else {
      console.error("Unexpected Error (applyJob):", error);
    }
    throw error;
  }
};

export const withdrawJob = async (jobId: number): Promise<void> => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;

    await axios.delete(`${API_BASE_URL}/jobs/${jobId}/withdraw`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error (withdrawJob):", error.response?.data);
    } else {
      console.error("Unexpected Error (withdrawJob):", error);
    }
    throw error;
  }
};

export const getAppliedJobs = async (): Promise<AppliedJob[]> => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;
    const response = await axios.get<AppliedJobsApiResponse>(`${API_BASE_URL}/talent/jobs-applied`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.data.status || !response.data.appliedJobs) {
      throw new Error("Invalid API response structure");
    }

    return response.data.appliedJobs;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to fetch applied jobs");
    }
    console.error("Error:", error);
    throw new Error("An unexpected error occurred");
  }
};


export interface Interview {
  id: number;
  application_id: number;
  user_id: number;
  interview_date: string;
  interviewer_role:string;
  interview_time: string;
  interview_location: string;
  interviewer_name: string;
  interviewer_department: string;
  interviewer_email: string;
  interviewer_phone: string;
  status: string;
  created_at: string;
  address : string;
  updated_at: string;
  job: any | null; // If job might be populated later, you can refine this type
}

interface InterviewApiResponse {
  status: boolean;
  interviews: Interview[];
}
export const getInterviews = async (): Promise<Interview[]> => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;
    const response = await axios.get<InterviewApiResponse>(`${API_BASE_URL}/talent/interviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.data.status || !response.data.interviews) {
      throw new Error("Invalid API response structure");
    }

    return response.data.interviews;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to fetch interviews");
    }
    console.error("Error:", error);
    throw new Error("An unexpected error occurred");
  }
};
export const fetchApplicationsForJob = async (id: number) => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;
    const response = await axios.get(`${API_BASE_URL}/admin/applications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.data.status || !response.data.application) {
      throw new Error("Invalid API response structure");
    }

    // Returning the application data directly
    return response.data.application;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to fetch application data");
    }
    console.error("Error:", error);
    throw new Error("An unexpected error occurred");
  }
};


 export interface Job {
  id: number;
  title: string;
  job_type: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  benefits?: string;
  skill: string;
  currency: string;
  minimum_salary: string;
  maximum_salary: string;
  location: string;
  application_deadline: string;
  additional_info: string | null;
  created_by: number;
  client_id: number;
  created_at: string;
  updated_at: string;
  status: string;
  applicant_count: number;
  client: Client;
}

interface Client {
  id: number;
  name: string;
  account_type: string;
  company_logo: string | null;
  company_name: string | null;
  company_email_address: string | null;
  industry: string | null;
  number_of_employees: number | null;
  type_of_employer: string | null;
  company_address: string | null;
  company_phone_number: string | null;
  country: string | null;
  company_website: string | null;
  contact_person: string | null;
  work_email: string | null;
  position_in_company: string | null;
  phone_number: string | null;
  cv_upload: string | null;
  cover_letter_upload: string | null;
  id_upload: string | null;
  video_url: string | null;
  project_screenshots: string | null;
  work_sample_upload: string | null;
  portfolio_link: string | null;
  profile_image: string | null;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  account_type: string;
  company_logo: string | null;
  company_name: string | null;
  company_email_address: string | null;
  industry: string | null;
  number_of_employees: string | null;
  type_of_employer: string | null;
  company_address: string | null;
  company_phone_number: string | null;
  country: string | null;
  company_website: string | null;
  contact_person: string | null;
  work_email: string | null;
  position_in_company: string | null;
  cv_upload: string | null;
  cover_letter_upload: string | null;
  id_upload: string | null;
  video_url: string | null;
  project_screenshots: string | null;
  work_sample_upload: string | null;
  portfolio_link: string | null;
  profile_image: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status: string;
}

interface Application {
  id: number;
  job_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  status: string;
  job: Job;
  user: User;
}

interface AppliedJobsApiResponse {
  status: boolean;
  applications: Application[];
  appliedJobs: AppliedJob[];
}

export const getAppliedJobtalent = async (): Promise<Application[]> => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;
    const response = await axios.get<AppliedJobsApiResponse>(`${API_BASE_URL}/talent/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.data.status || !response.data.applications) {
      throw new Error("Invalid API response structure");
    }

    return response.data.applications;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to fetch applied jobs");
    }
    console.error("Error:", error);
    throw new Error("An unexpected error occurred");
  }
};
export const getAppliedJob = async (): Promise<Application[]> => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;
    const response = await axios.get<AppliedJobsApiResponse>(`${API_BASE_URL}/admin/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.data.status || !response.data.applications) {
      throw new Error("Invalid API response structure");
    }

    return response.data.applications;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to fetch applied jobs");
    }
    console.error("Error:", error);
    throw new Error("An unexpected error occurred");
  }
};

export const getApplicationById = async (id: string): Promise<Application> => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;

    const response = await axios.get<{ status: boolean; application: Application }>(
      `${API_BASE_URL}/admin/applications/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.status || !response.data.application) {
      throw new Error("Invalid API response structure");
    }

    return response.data.application;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to fetch application");
    }
    console.error("Error:", error);
    throw new Error("An unexpected error occurred");
  }
};

interface SendToClientRequest {
  job_id: number;
  client_id: number;
  applications: number[];
}

export const sendApplicationToClient = async (data: SendToClientRequest): Promise<void> => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;

    const response = await axios.post(`${API_BASE_URL}/admin/applications/send-to-client`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to send application to client");
    }

    console.log("Application sent successfully");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to send application to client");
    }
    console.error("Error:", error);
    throw new Error("An unexpected error occurred");
  }
};

interface SendToAdminRequest {
  job_id: number;
  applications: number[];
  selected_candidates: number[];
}


export const sendApplicationToAdmin = async (data: SendToAdminRequest): Promise<void> => {
  try {
    const session = await getSession();
    if (!session || !session.user) throw new Error("User is not authenticated");

    const token = session.user.accessToken;

    const response = await axios.post(`${API_BASE_URL}/client/applications/select-candidates`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to send application to client");
    }

    console.log("Application sent successfully");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to send application to client");
    }
    console.error("Error:", error);
    throw new Error("An unexpected error occurred");
  }
};