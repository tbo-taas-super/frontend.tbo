import { API_BASE_URL } from "@/@core/utils/constants";

import axios, { AxiosResponse } from "axios";
import { getSession } from 'next-auth/react';

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  joined_date: string;
}

export interface AdminStatsData {
  total_users: number;
  total_applications: number;
  total_interviews: number;
  total_jobs: number;
  active_jobs: number;
  total_companies: number;
  recent_users: RecentUser[];
}

export const getAdminStats = async (): Promise<AdminStatsData> => {
  const response = await axios.get(`${API_BASE_URL}/admin/stats`);
  return response.data;
};
