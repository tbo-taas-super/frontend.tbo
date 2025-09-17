import { API_BASE_URL } from "@/@core/utils/constants";

import axios, { AxiosResponse } from "axios";
import { getSession } from 'next-auth/react';

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  joined_date: string;
}

export interface StatsData {
  total_users: number;
  total_applications: number;
  total_interviews: number;
  total_jobs: number;
  active_jobs: number;
  total_companies: number;
  recent_users: RecentUser[];

  saved_jobs_count: number;
  applied_jobs_count: number;
  interviews_count: number;
  latest_saved_jobs: {
    id: number;
    job_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    job: {
      id: number;
      title: string;
    };
  }[];
  latest_applied_jobs: {
    id: number;
    job_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    status: string;
    job: {
      id: number;
      title: string;
    };
  }[];
  latest_interviews: {
    id: number;
    application_id: number;
    user_id: number;
    interview_date: string;
    interview_time: string;
    interview_location: string;
    interviewer_name: string;
    interviewer_department: string;
    interviewer_email: string;
    interviewer_phone: string;
    status: string;
    created_at: string;
    updated_at: string;
    job: any; // or a more specific type if available
  }[];
}





export const getAdminStats = async (): Promise<StatsData> => {
  try {
    const response: AxiosResponse<StatsData> = await axios.get(
      `${API_BASE_URL}/admin/stats`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};


export interface StatsDataclient {
  total_users: number;
  total_applications: number;
  total_interviews: number;
  total_jobs: number;
  active_jobs: number;
  total_companies: number;
  recent_users: RecentUser[];
  client_statistics: ClientStatistics;
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  joined_date: string; // ISO date string
}

export interface ClientStatistics {
  total_jobs_listed: number;
  total_job_views: number;
  top_performing_jobs: TopPerformingJob[];
  hired_candidates: number;
  average_time_to_hire_days: number;
  application_rate: number;
  last_3_applications: Application[];
  application_status_counts: Record<ApplicationStatus, number>;
}

export interface TopPerformingJob {
  id: number;
  title: string;
  applications: number;
  created_at: string; // ISO date string
}

export interface Application {
  id: number;
  job_title: string;
  applicant_name: string;
  status: ApplicationStatus;
  applied_date: string; // ISO date string
}

export type ApplicationStatus = 'PENDING' | 'REJECTED' | 'SHORTLISTED' | 'HIRED';

export const getClientStats = async (): Promise<StatsDataclient> => {
  const session = await getSession();
    const token = session?.user?.accessToken;
  
    if (!token) throw new Error("Missing token");
  try {
    const response: AxiosResponse<StatsDataclient> = await axios.get(
      `${API_BASE_URL}/client/stats`
      , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};

export const getTalentStats = async (): Promise<StatsData> => {
    const session = await getSession();
    const token = session?.user?.accessToken;
  
    if (!token) throw new Error("Missing token");
  try {
    const response: AxiosResponse<StatsData> = await axios.get(
      `${API_BASE_URL}/talent/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};