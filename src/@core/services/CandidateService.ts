import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "@/@core/utils/constants"
import { getSession } from 'next-auth/react';
// Admin data Interface
export interface CandidateData {
  id: number;
  name: string;
  email: string;
  experience: string;
  dateApplied: string;
  status: string;
  clients: string;
  applications: number;
  phone_number: string;
  date: string;
}

// API response interface
interface APIResponse {
  talents: CandidateData[];
}


// Function to fetch all candidates
export const getCandidates = async (): Promise<CandidateData[]> => {
  try {
    const response: AxiosResponse<APIResponse> = await axios.get(
      `${API_BASE_URL}admin/talents`
    );
    return response.data.talents; // Return the fetched data
  } catch (error) {
    console.error("Error fetching admin data:", error);
    throw error;
  }
};


export const activateCandidate = async (ClientId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/talents/${ClientId}/activate`, {
      method: 'PUT',
    });
    
    if (!response.ok) {
      throw new Error('Failed to activate job');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error activating job:', error);
    throw error;
  }
};

export const deactivateCandidate = async (ClientId: number): Promise<any> => {
  const session = await getSession(); 
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken; 

  const response = await fetch(`${API_BASE_URL}/admin/talents/${ClientId}/deactivate`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to deactivate job');
  }

  const data = await response.json();
  return data; 
};
export const deleteCandidate = async (ClientId: number): Promise<any> => {
  const session = await getSession(); 
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken; 

  const response = await fetch(`${API_BASE_URL}/admin/talents/${ClientId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to deactivate job');
  }

  const data = await response.json();
  return data; 
};

