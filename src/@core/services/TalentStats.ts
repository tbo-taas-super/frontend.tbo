import { API_BASE_URL } from "@/@core/utils/constants";

import axios, { AxiosResponse } from "axios";
import { getSession } from 'next-auth/react';

export interface TalentStatsData {
  saved_jobs_count: number;
  applied_jobs_count: number;
  interviews_count: number;
  latest_saved_jobs: {
    id: number;
    job_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    job: { id: number; title: string };
  }[];
  latest_applied_jobs: {
    id: number;
    job_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    status: string;
    job: { id: number; title: string };
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
    job: any; // optionally define Job type
  }[];
}


export const getTalentStats = async (): Promise<TalentStatsData> => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (!token) throw new Error("Missing token");

  const response = await axios.get(`${API_BASE_URL}/talent/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
