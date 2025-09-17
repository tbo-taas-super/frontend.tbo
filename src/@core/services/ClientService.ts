import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "@/@core/utils/constants";
import { getSession } from 'next-auth/react';

// Admin data Interface
export interface ClientData {
  id: number;
  name: string;
  account_type: string;
  company_logo: string;
  company_name: string;
  company_email_address: string;
  phone_number: string | null;
  country_code?:string |null;
  industry: string;
  number_of_employees: string;
  type_of_employer: string;
  company_address: string;
  company_phone_number: string ;
  country: string | null;
  company_website: string;
  contact_person: string;
  work_email: string;
  position_in_company: string;
  email: string;
  status: string;
  // Add other fields as needed
}

// API response interface for client list
interface APIResponse {
  clients: ClientData[];
}

// API response interface for single client operations
interface ClientAPIResponse {
  status: boolean;
  message: string;
  client?: ClientData;
}

// Function to fetch all clients
export const getClients = async (): Promise<ClientData[]> => {
  try {
    const response: AxiosResponse<APIResponse> = await axios.get(
      `${API_BASE_URL}/admin/clients`
    );
    return response.data.clients; // Return the fetched data
  } catch (error) {
    console.error("Error fetching admin data:", error);
    throw error;
  }
};

// Function to edit a client
export const editClient = async (clientId: number, clientData: Partial<ClientData>): Promise<ClientData> => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  try {
    const response: AxiosResponse<ClientAPIResponse> = await axios.put(
      `${API_BASE_URL}/admin/clients/${clientId}`,
      clientData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to update client');
    }

    return response.data.client as ClientData; // Return the updated client
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

// Function to activate a client
export const activateClient = async (clientId: number): Promise<ClientAPIResponse> => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  try {
    const response = await fetch(`${API_BASE_URL}/admin/clients/${clientId}/activate`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to activate client');
    }

    return await response.json();
  } catch (error) {
    console.error('Error activating client:', error);
    throw error;
  }
};

// Function to deactivate a client
export const deactivateClient = async (clientId: number): Promise<ClientAPIResponse> => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  try {
    const response = await fetch(`${API_BASE_URL}/admin/clients/${clientId}/deactivate`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to deactivate client');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deactivating client:', error);
    throw error;
  }
};

// Function to delete a client
export const deleteClient = async (clientId: number): Promise<ClientAPIResponse> => {
  const session = await getSession();
  if (!session || !session.user) throw new Error("User is not authenticated");

  const token = session.user.accessToken;

  try {
    const response = await fetch(`${API_BASE_URL}/admin/clients/${clientId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete client');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};