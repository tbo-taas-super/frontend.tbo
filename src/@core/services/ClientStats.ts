import { API_BASE_URL } from "@/@core/utils/constants";

import axios, { AxiosResponse } from "axios";
import { getSession } from 'next-auth/react';

export interface ClientStatsData {
  total_users: number;
  total_applications: number;
  total_interviews: number;
  total_jobs: number;
  active_jobs: number;
  total_companies: number;
  recent_users: RecentUser[]; // Define RecentUser interface below or import it if it exists elsewhere
  client_statistics: ClientStatistics;
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
  created_at: string;
}

export interface Application {
  id: number;
  job_title: string;
  applicant_name: string;
  status: ApplicationStatus;
  applied_date: string;
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  joined_date: string;
}

export type ApplicationStatus = "PENDING" | "REJECTED" | "SHORTLISTED" | "HIRED";


export const getClientStats = async (): Promise<ClientStatsData> => {
  const response = await axios.get(`${API_BASE_URL}/client/stats`);
  return response.data;
};
