import { API_BASE_URL } from "@/@core/utils/constants"
import axios, { AxiosResponse } from "axios";
import { ReactNode } from "react";
import { getSession } from 'next-auth/react';
// Admin data Interface
export interface AdminData {
  account_type: ReactNode;
  id: number;
  name: string;
  email: string;
  level: string;
  role: string;
  status: boolean;
}

// API response interface
interface APIResponse {
  admins: AdminData[];
}

// API base URL API

// Function to fetch admin data
export const getAdmins = async (): Promise<AdminData[]> => {
  try {
    const response: AxiosResponse<APIResponse> = await axios.get(
      `${API_BASE_URL}/admin/admins`
    );
    console.log(response); // Log the full response for debugging
    console.log(response.data.admins); // Log the correct data field

    return response.data.admins; // Return the correct field from the response
  } catch (error) {
    console.error("Error fetching admin data:", error);
    throw error;
  }
};

export const getAdminById = async (adminId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/admins/${adminId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin:", error);
    throw error;
  }
};

export const deleteAdmin = async (adminId: string) => {
   const session = await getSession(); 
    if (!session || !session.user) throw new Error("User is not authenticated");
    const token = session.user.accessToken;

  try {
    const response = await axios.delete(`${API_BASE_URL}/admin/admins/${adminId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
};


console.log(getAdmins());



// Talent data interface based on the Laravel migration
interface TalentData {
  id: number;
  name: string;
  email: string;
  account_type: string; // Changed to string since API returns "TALENT"
  phone_number?: string | null;
  cv_upload?: string | null;
  cover_letter_upload?: string | null;
  id_upload?: string | null;
  video_url?: string | null;
  project_screenshots?: string[] | null;
  work_sample_upload?: string | null;
  portfolio_link?: string | null;
  profile_image?: string | null;
  designation?: string | null;
  location?: string | null;
  years_experience?: number | null;
  availability_status?: "open_to_work" | "passive" | null;
  professional_summary?: string | null;
  skills?: string[] | null;
  current_company?: string | null;
  education?: string | null; // Changed to string | null to match API response
  email_verified_at?: string | null;
  otp?: string | null;
  otp_expires_at?: string | null;
  is_verified?: number;
  isPasswordChange?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  status?: string;
  reset_token?: string | null;
}
// API response interface for talents
interface TalentAPIResponse {
  talents: TalentData[];
}

// Function to fetch all talents
export const getTalents = async (): Promise<TalentData[]> => {
  try {
    const response: AxiosResponse<TalentAPIResponse> = await axios.get(
      `${API_BASE_URL}/admin/talents`
    );
    console.log(response); // Log the full response for debugging
    console.log(response.data.talents); // Log the talents data field

    return response.data.talents; // Return the talents array
  } catch (error) {
    console.error("Error fetching talents data:", error);
    throw error;
  }
};

// Function to fetch a talent by ID
export const getTalentById = async (talentId: string): Promise<TalentData> => {
  try {
    const response: AxiosResponse<TalentData> = await axios.get(
      `${API_BASE_URL}/admin/talents/${talentId}`
    );
    console.log(response); // Log the full response for debugging
    console.log(response.data); // Log the talent data

    return response.data; // Return the single talent object
  } catch (error) {
    console.error(`Error fetching talent with ID ${talentId}:`, error);
    throw error;
  }
};

// Function to delete a talent (if needed)
export const deleteTalent = async (talentId: string): Promise<void> => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");
  const token = session.user.accessToken;

  try {
    const response = await axios.delete(`${API_BASE_URL}/admin/talents/${talentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`Talent with ID ${talentId} deleted successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting talent with ID ${talentId}:`, error);
    throw error;
  }
};

// Example usage in an async context
const fetchTalents = async () => {
  try {
    const talents = await getTalents();
    console.log("Fetched talents:", talents);

    // Example: Fetch a specific talent by ID
    const talentId = "123"; // Replace with actual ID
    const talent = await getTalentById(talentId);
    console.log(`Fetched talent with ID ${talentId}:`, talent);
  } catch (error) {
    console.error("Error in fetchTalents:", error);
  }
};

// Call the function (in an async context, e.g., inside a component or script)
fetchTalents();